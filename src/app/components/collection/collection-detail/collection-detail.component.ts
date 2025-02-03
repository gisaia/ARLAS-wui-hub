/*
 * Licensed to Gisaïa under one or more contributor
 * license agreements. See the NOTICE.txt file distributed with
 * this work for additional information regarding copyright
 * ownership. Gisaïa licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { AfterViewInit, Component, DestroyRef, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CollectionService } from 'app/services/collection.service';
import { CollectionField, extractProp } from 'app/tools/tools';
import { CollectionReferenceDescription, CollectionReferenceUpdateOrg } from 'arlas-api';
import { UserOrgData } from 'arlas-iam-api';
import { ArlasCollaborativesearchService, ArlasIamService, ArlasSettingsService, ArlasStartupService } from 'arlas-wui-toolkit';
import { finalize, of, switchMap } from 'rxjs';

@Component({
    selector: 'arlas-collection-detail',
    templateUrl: './collection-detail.component.html',
    styleUrl: './collection-detail.component.scss'
})
export class CollectionDetailComponent implements OnInit, AfterViewInit {
    @ViewChild('fieldTableSort', { static: true }) public sort: MatSort;

    public collection: CollectionReferenceDescription;
    public collectionName: string;
    public fields: CollectionField[];

    public collectionForm: FormGroup;

    public displayedColumns = ['name', 'display_name', 'type', 'indexed', 'taggable'];
    public isLoading = false;

    public isAuthentActivated: boolean;
    public authentMode: 'openid' | 'iam';
    public organisations: WritableSignal<UserOrgData[]> = signal([]);
    public dataSourceFields: MatTableDataSource<any> = new MatTableDataSource([]);

    public constructor(
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private collabSearchService: ArlasCollaborativesearchService,
        private router: Router,
        private formBuilder: FormBuilder,
        private collectionService: CollectionService,
        private snackbar: MatSnackBar,
        private translate: TranslateService,
        private arlasIamService: ArlasIamService,
        private arlasStartupService: ArlasStartupService,
        private arlasSettingsService: ArlasSettingsService
    ) {
        const authSettings = this.arlasSettingsService.getAuthentSettings();
        this.isAuthentActivated = !!authSettings && authSettings.use_authent;
        const isOpenID = this.isAuthentActivated && authSettings.auth_mode !== 'iam';
        const isIam = this.isAuthentActivated && authSettings.auth_mode === 'iam';
        if (isOpenID) {
            this.authentMode = 'openid';
        }
        if (isIam) {
            this.authentMode = 'iam';
        }
    }

    public ngOnInit(): void {
        if (this.arlasStartupService.shouldRunApp) {
            if (this.authentMode === 'iam') {
                if (!!this.arlasIamService.user) {
                    this.organisations.set(this.arlasIamService.user.organisations);
                    this.collectionService.setOptions({
                        headers: {
                            Authorization: 'bearer ' + this.arlasIamService.getAccessToken()
                        }
                    });
                } else {
                    this.organisations.set([]);
                    this.collectionService.setOptions({});
                }
            }
            this.collectionForm = this.formBuilder.group({
                collection_display_name: new FormControl(''),
                display_names: this.formBuilder.array([]),
                shared_orgs: new FormControl()
            });
            this.route.paramMap
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: params => {

                        this.collectionName = params.get('name');
                        if (!!this.collectionName) {
                            this.isLoading = true;
                            this.collabSearchService.describe(this.collectionName, false, 0)
                                .pipe(finalize(() => this.isLoading = false)).
                                subscribe({
                                    next: (c) => {
                                        this.fillForm(c);
                                    }
                                });
                        }
                    }
                });
        }

    }

    public ngAfterViewInit(): void {

    }

    public get displayNames(): FormArray {
        return this.collectionForm.get('display_names') as FormArray;
    }

    public back() {
        this.router.navigate(['collection']);
    }

    public update() {
        this.isLoading = true;
        const collectionControl = this.collectionForm.get('collection_display_name');
        const fieldsControl = this.collectionForm.get('display_names');
        const sharedOrgsControl = this.collectionForm.get('shared_orgs');

        let collectionObs = of({});
        if (collectionControl.dirty && collectionControl.touched) {
            const collectionDisplayName = collectionControl.value;
            collectionObs = this.collectionService.updateCollectionDisplayName(collectionDisplayName, this.collection.collection_name);
        }

        const fieldsBody = {};
        let updateFields = false;
        if (fieldsControl.dirty && fieldsControl.touched) {
            updateFields = true;
            const fields: CollectionField[] = fieldsControl.value;
            fields.forEach(f => fieldsBody[f.name] = f.display_name);
        }

        const sharedOrgsBody: CollectionReferenceUpdateOrg = {};
        let updateSharedOrgs = false;
        if (sharedOrgsControl.dirty && sharedOrgsControl.touched) {
            updateSharedOrgs = true;
            (sharedOrgsBody as any).public = (this.collection.params.organisations as any).public;
            sharedOrgsBody.shared = sharedOrgsControl.value;
        }
        // SwitchMap needed to wait the previous observable
        // The same document is updated
        collectionObs.pipe(
            switchMap(
                () => updateFields ? this.collectionService.updateFields(fieldsBody, this.collection.collection_name) : of({})
            ),
            switchMap(
                () => updateSharedOrgs ? this.collectionService.updateCollectionOrg(sharedOrgsBody, this.collection.collection_name) : of({})
            )
        ).subscribe({
            next: () => {
                this.collabSearchService.describe(this.collection.collection_name, false, 0)
                    .pipe(finalize(() => this.isLoading = false))
                    .subscribe({
                        next: (c) => {
                            this.snackbar.open(
                                this.translate.instant('Collection updated'), 'Ok',
                                {
                                    duration: 3000, panelClass: 'collection-update--success',
                                    horizontalPosition: 'center', verticalPosition: 'top'
                                }
                            );
                            this.fillForm(c);
                            this.collectionForm.markAsPristine();
                            this.collectionForm.markAsUntouched();
                        }
                    });
            },
            error: () => {
                this.updateFailed();
            }
        });
    }

    private fillForm(c: CollectionReferenceDescription) {
        this.collection = c;
        this.fields = extractProp(c);
        this.collectionForm.get('collection_display_name').setValue(this.collection.params.display_names.collection);
        this.collectionForm.get('shared_orgs').setValue(this.collection.params.organisations.shared);
        this.collectionForm.setControl('display_names', new FormArray(this.fields.map(CollectionField.asFormGroup)));
        this.dataSourceFields = new MatTableDataSource(
            (this.collectionForm.get('display_names') as FormArray).controls.map(c => ({
                name: c.get('name').value,
                type: c.get('type').value,
                taggable: c.get('taggable').value,
                indexed: c.get('indexed').value,
                control: c.get('display_name')
            }))
        );
        this.dataSourceFields.sort = this.sort;
        this.dataSourceFields.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
            if (typeof data[sortHeaderId] === 'string') {
                return data[sortHeaderId].toLocaleLowerCase();
            }
            if (sortHeaderId === 'display_name') {
                return data.control.value.toLocaleLowerCase();
            }
            return data[sortHeaderId];
        };
    }

    private updateFailed() {
        this.isLoading = false;
        this.snackbar.open(
            this.translate.instant('Update fail'), 'Ok',
            {
                duration: 3000, panelClass: 'collection-update--failed',
                horizontalPosition: 'center', verticalPosition: 'top'
            }
        );
    }
}


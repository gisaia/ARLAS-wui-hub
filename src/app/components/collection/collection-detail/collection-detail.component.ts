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
import { Component, DestroyRef, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { CollectionService } from 'app/services/collection.service';
import { CollectionField, extractProp } from 'app/tools/tools';
import { CollectionReferenceDescription, CollectionReferenceUpdateOrg } from 'arlas-api';
import { RoleData, UserOrgData } from 'arlas-iam-api';
import {
    ArlasCollaborativesearchService, ArlasIamService,
    ArlasSettingsService, ArlasStartupService,
    AuthentificationService
} from 'arlas-wui-toolkit';
import jwt_decode from 'jwt-decode';
import { filter, finalize, mergeMap, of, switchMap } from 'rxjs';
import { ConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';

@Component({
    selector: 'arlas-collection-detail',
    templateUrl: './collection-detail.component.html',
    styleUrl: './collection-detail.component.scss'
})
export class CollectionDetailComponent implements OnInit {
    @ViewChild('fieldTableSort', { static: true }) public sort: MatSort;

    public collection: CollectionReferenceDescription;
    public collectionName: string;
    public fields: CollectionField[];

    public collectionForm: FormGroup;

    public displayedColumns = ['name', 'display_name', 'type', 'indexed', 'taggable'];
    public isLoading = false;
    public filterValue = '';

    public isAuthentActivated: boolean;
    public authentMode: 'openid' | 'iam';
    public organisations: WritableSignal<UserOrgData[]> = signal([]);
    public dataSourceFields: MatTableDataSource<any> = new MatTableDataSource([]);
    public canEdit = false;
    private connected = false;

    public editMode = false;
    public formInitialValues;

    public constructor(
        private readonly destroyRef: DestroyRef,
        private readonly route: ActivatedRoute,
        private readonly collabSearchService: ArlasCollaborativesearchService,
        private readonly router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly collectionService: CollectionService,
        private readonly snackbar: MatSnackBar,
        private readonly translate: TranslateService,
        private readonly arlasIamService: ArlasIamService,
        private readonly arlasStartupService: ArlasStartupService,
        private readonly arlasSettingsService: ArlasSettingsService,
        private readonly dialog: MatDialog,
        private readonly authenticationService: AuthentificationService,
        private readonly iconRegistry: MatIconRegistry,
        private readonly sanitizer: DomSanitizer
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
        this.iconRegistry.addSvgIcon('keyword', this.sanitizer.bypassSecurityTrustResourceUrl(location.origin + '/assets/keyword.svg'));
    }

    public ngOnInit(): void {
        if (this.arlasStartupService.shouldRunApp) {
            if (this.authentMode === 'iam') {
                if (this.arlasIamService.user) {
                    this.connected = true;
                    this.organisations.set(this.arlasIamService.user.organisations);
                    const headers = {
                        headers: {
                            Authorization: 'bearer ' + this.arlasIamService.getAccessToken()
                        }
                    };
                    this.collectionService.setOptions(headers);
                    this.collabSearchService.setFetchOptions(headers);
                } else {
                    this.connected = false;
                    this.organisations.set([]);
                    this.collectionService.setOptions({});
                }
            } else if (this.authentMode === 'openid') {
                this.connected = true;
                const headers = {
                    headers: {
                        Authorization: 'bearer ' + this.authenticationService.accessToken
                    }
                };
                this.collectionService.setOptions(headers);
                this.collabSearchService.setFetchOptions(headers);
            } else {
                this.connected = false;
                this.organisations.set([]);
                this.collectionService.setOptions({});
            }
            this.collectionForm = this.formBuilder.group({
                collection_display_name: new FormControl(''),
                display_names: this.formBuilder.array([]),
                shared_orgs: new FormControl()
            });
            this.route.paramMap
                .pipe(
                    takeUntilDestroyed(this.destroyRef),
                    mergeMap((params) => {
                        this.collectionName = params.get('name');
                        if (this.collectionName) {
                            this.isLoading = true;
                            return this.collabSearchService.describe(this.collectionName, false, 0).pipe(
                                finalize(() => this.isLoading = false)
                            );
                        }
                    })
                )
                .subscribe({
                    next: (c) => {
                        this.fillForm(c);
                    },
                    error: () => {
                        this.snackbar.open(
                            this.translate.instant('Error while fetching collection detail'), 'Ok',
                            {
                                duration: 3000, panelClass: 'collection-snack--error',
                                horizontalPosition: 'center', verticalPosition: 'top'
                            }
                        );
                    }
                });
        }
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
            // always add the owner org in the shared orgs
            sharedOrgsBody.shared.push(this.collection.params.organisations.owner);
        }
        // SwitchMap needed to wait the previous observable
        // The same document is updated
        collectionObs.pipe(
            switchMap(
                () => updateFields ? this.collectionService.updateFields(fieldsBody, this.collection.collection_name) : of({})
            ),
            switchMap(
                () => updateSharedOrgs ? this.collectionService.updateCollectionOrg(sharedOrgsBody, this.collection.collection_name) : of({})
            ),
            mergeMap(() => this.collabSearchService.describe(this.collection.collection_name, false, 0)
                .pipe(finalize(() => {
                    this.isLoading = false;
                    this.editMode = false;
                }))
            )
        ).subscribe({
            next: (c) => {
                this.snackbar.open(
                    this.translate.instant('Collection updated'), 'Ok',
                    {
                        duration: 3000, panelClass: 'collection-snack--success',
                        horizontalPosition: 'center', verticalPosition: 'top'
                    }
                );
                this.fillForm(c);
                this.collectionForm.markAsPristine();
                this.collectionForm.markAsUntouched();
            },
            error: () => {
                this.updateFailed();
            }
        });
    }

    public applyFilter(event: Event) {
        this.filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceFields.filter = this.filterValue.trim().toLowerCase();
    }

    public resetFormValue() {
        this.collectionForm.reset(this.formInitialValues);
    }

    public toggleMode() {
        this.editMode = !this.editMode;
    }

    public cancel() {
        if (this.collectionForm.dirty) {
            const matDialogRef = this.dialog.open(ConfirmModalComponent, {
                data: {
                    title: marker('You have unsaved changes'),
                    message: marker('Are you sure you want to discard them?')
                },
                disableClose: true
            });
            matDialogRef.afterClosed()
                .pipe(filter(result => result !== false))
                .subscribe(() => {
                    this.resetFormValue();
                    this.toggleMode();
                });
        } else {
            this.resetFormValue();
            this.toggleMode();
        }
    }

    public openDelete(collectionName: string) {
        const matDialogRef = this.dialog.open(ConfirmModalComponent, {
            data: {
                title: marker('Delete collection'),
                message: marker('Are you sure you want to delete the collection named:'),
                param: collectionName
            },
            disableClose: true
        });
        matDialogRef.afterClosed()
            .pipe(filter(result => result !== false))
            .subscribe(() => {
                this.collectionService.deleteCollection(collectionName).subscribe({
                    next: () => {
                        this.snackbar.open(
                            this.translate.instant('Collection deleted'), 'Ok',
                            {
                                duration: 3000, panelClass: 'collection-snack--success',
                                horizontalPosition: 'center', verticalPosition: 'top'
                            }
                        );
                        // Add timeout after DELETE request to prevent listing deleted collection
                        setTimeout(() => this.router.navigate(['collection']), 500);
                    },
                    error: (err) => {
                        this.snackbar.open(
                            this.translate.instant('Error:') + err, 'Ok',
                            {
                                duration: 3000, panelClass: 'collection-snack--failed',
                                horizontalPosition: 'center', verticalPosition: 'top'
                            }
                        );
                    }
                });
            });

    }

    private fillForm(c: CollectionReferenceDescription) {
        this.collection = c;
        if (this.connected) {
            if (this.authentMode === 'iam') {
                this.canEdit = this.checkIfuserCanEdit(this.arlasIamService.user.roles, c.params.organisations.owner);
            } else if (this.authentMode === 'openid') {
                this.canEdit = this.roles.includes('role/arlas/datasets');
            }
        }

        this.organisations.set(this.organisations().filter(o => o.name !== c.params.organisations.owner));
        this.fields = extractProp(c);
        this.collectionForm.get('collection_display_name').setValue(this.collection.params.display_names?.collection);
        this.collectionForm.get('shared_orgs').setValue(
            this.collection.params.organisations.shared.filter(o => o !== c.params.organisations.owner)
        );
        this.collectionForm.setControl('display_names', new FormArray(this.fields.map(CollectionField.asFormGroup)));
        this.formInitialValues = this.collectionForm.value;
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
        this.dataSourceFields.filterPredicate = (data, filter: string): boolean =>
            data.name.toLowerCase().includes(filter) || data.type.toLowerCase().includes(filter)
            || data.control.value.toLowerCase().includes(filter);
        if (this.filterValue !== '') {
            this.dataSourceFields.filter = this.filterValue.trim().toLowerCase();
        }
    }

    private updateFailed() {
        this.isLoading = false;
        this.snackbar.open(
            this.translate.instant('Update failed'), 'Ok',
            {
                duration: 3000, panelClass: 'collection-snack--failed',
                horizontalPosition: 'center', verticalPosition: 'top'
            }
        );
    }

    private checkIfuserCanEdit(roles: RoleData[], orgOnwer: string): boolean {
        return roles.filter(r => !!r.organisation && r.organisation.name === orgOnwer).map(ro => ro.name).includes('role/arlas/datasets');
    }

    private get roles(): Array<string> {
        if (this.authenticationService.accessToken) {
            return jwt_decode<Record<string, any>>(this.authenticationService.accessToken)['resource_access']['arlas-backend']['roles'];
        } else {
            return [];
        }
    }
}


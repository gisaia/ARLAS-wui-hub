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
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionService } from 'app/services/collection.service';
import { CollectionField, extractProp } from 'app/tools/tools';
import { CollectionReferenceDescription } from 'arlas-api';
import { ArlasCollaborativesearchService } from 'arlas-wui-toolkit';
import { finalize } from 'rxjs';

@Component({
    selector: 'arlas-collection-detail',
    templateUrl: './collection-detail.component.html',
    styleUrl: './collection-detail.component.scss'
})
export class CollectionDetailComponent implements OnInit {
    public collection: CollectionReferenceDescription;
    public collectionName: string;
    public fields: CollectionField[];

    public collectionForm: FormGroup;

    public displayedColumns = ['name', 'display_name', 'type', 'indexed', 'taggable'];
    public isLoading = false;

    public constructor(
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private collabSearchService: ArlasCollaborativesearchService,
        private router: Router,
        private formBuilder: FormBuilder,
        private collectionService: CollectionService,
        private snackbar: MatSnackBar
    ) {

    }

    public ngOnInit(): void {
        this.route.paramMap
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: params => {
                    this.collectionForm = this.formBuilder.group({
                        collection_display_name: new FormControl(''),
                        display_names: this.formBuilder.array([])
                    });

                    this.collectionName = params.get('name');
                    if (!!this.collectionName) {
                        this.collabSearchService.describe(this.collectionName).subscribe({
                            next: (c) => {
                                this.collection = c;
                                this.fields = extractProp(c);
                                this.collectionForm.get('collection_display_name').setValue(this.collection.params.display_names.collection);
                                this.collectionForm.setControl('display_names', new FormArray(this.fields.map(CollectionField.asFormGroup)));
                            }
                        });
                    }
                }
            });
    }

    public get displayNames(): FormArray {
        return this.collectionForm.get('display_names') as FormArray;
    }

    public back() {
        this.router.navigate(['collection']);
    }

    public update() {
        this.isLoading = true;
        const body = {};
        const fields: CollectionField[] = this.collectionForm.get('display_names').value;
        fields.filter(field => field.type !== 'OBJECT').forEach(f => body[f.name] = f.display_name);
        this.collectionService.updateFields(body, this.collection.collection_name)
            .subscribe({
                next: (collection) => {
                    this.collabSearchService.describe(collection.collection_name)
                        .pipe(finalize(() => this.isLoading = false))
                        .subscribe({
                            next: (c) => {
                                this.snackbar.open(
                                    'Collection updated', 'Ok',
                                    {
                                        duration: 30000, panelClass: 'collection-update--success',
                                        horizontalPosition: 'center', verticalPosition: 'top'
                                    }
                                );
                                this.collection = c;
                                this.fields = extractProp(c);
                                this.collectionForm.get('collection_display_name').setValue(this.collection.params.display_names.collection);
                                this.collectionForm.setControl('display_names', new FormArray(this.fields.map(CollectionField.asFormGroup)));
                            }
                        });
                },
                error: (err) => {
                    this.isLoading = false;
                    this.snackbar.open(
                        'Update fail', 'Ok',
                        {
                            duration: 3000, panelClass: 'collection-update--failed',
                            horizontalPosition: 'center', verticalPosition: 'top'
                        }
                    );
                    console.error(err);
                }
            });
    }
}


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
import { ActivatedRoute } from '@angular/router';
import { extractProp } from 'app/tools/tools';
import { CollectionReferenceDescription, CollectionReferenceDescriptionProperty } from 'arlas-api';
import { ArlasCollaborativesearchService } from 'arlas-wui-toolkit';

@Component({
    selector: 'arlas-collection-detail',
    templateUrl: './collection-detail.component.html',
    styleUrl: './collection-detail.component.scss'
})
export class CollectionDetailComponent implements OnInit {
    public collection: CollectionReferenceDescription;
    public collectionName: string;
    public fields: CollectionReferenceDescriptionProperty[];

    public displayedColumns = ['name', 'display_name', 'type', 'indexed', 'taggable'];

    public constructor(
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private collabSearchService: ArlasCollaborativesearchService
    ) {

    }

    public ngOnInit(): void {
        this.route.paramMap
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: params => {
                    this.collectionName = params.get('name');
                    if (!!this.collectionName) {
                        this.collabSearchService.describe(this.collectionName).subscribe({
                            next: (c) => {
                                this.collection = c;
                                this.fields = extractProp(c.properties);
                            }
                        });
                    }
                }
            });
    }
}


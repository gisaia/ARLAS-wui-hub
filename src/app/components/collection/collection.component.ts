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
import { AfterViewInit, Component, model, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CollectionReferenceDescription } from 'arlas-api';
import {
    ArlasCollaborativesearchService, ArlasIamService,
    ArlasSettingsService, ArlasStartupService, ConfirmModalComponent
} from 'arlas-wui-toolkit';
import { filter, finalize, forkJoin, Observable } from 'rxjs';
import { CollectionService } from '../../services/collection.service';
import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export interface CollectionInfos extends CollectionReferenceDescription {
    canEdit?: boolean;
}

@Component({
    selector: 'arlas-collection',
    templateUrl: './collection.component.html',
    styleUrl: './collection.component.scss'
})
export class CollectionComponent implements OnInit, AfterViewInit {

    @ViewChild('paginator') public paginator: MatPaginator;

    public connected: WritableSignal<boolean> = signal(false);
    public organisations: WritableSignal<string[]> = signal([]);
    public organisationsNames = model([]);

    public collections: WritableSignal<CollectionReferenceDescription[]> = signal([]);
    public collectionDataSource: MatTableDataSource<CollectionReferenceDescription> = new MatTableDataSource([]);

    public isAuthentActivated: boolean;
    public authentMode: 'openid' | 'iam';

    public displayedColumns = ['collection_name', 'display_name'];
    public isLoading = false;

    // Filters
    public isPublic = true;
    public searchValue = '';

    public constructor(
        private collectionService: CollectionService,
        private arlasSettingsService: ArlasSettingsService,
        private arlasIamService: ArlasIamService,
        private arlasStartupService: ArlasStartupService,
        private collabSearchService: ArlasCollaborativesearchService,
        private dialog: MatDialog,
        private translate: TranslateService,
        private router: Router
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

    public compareFn(o1, o2): boolean {
        return o1 && o2 ? o1.name === o2.name : o1 === o2;
    }

    public ngOnInit(): void {
        if (this.arlasStartupService.shouldRunApp) {
            if (!this.isAuthentActivated) {
                this.getCollections();
                this.displayedColumns.push('action');
            } else {
                if (this.authentMode === 'iam') {
                    if (!!this.arlasIamService.user) {
                        this.displayedColumns.push(...['is_public', 'owner', 'shared_with']);
                        this.getCollectionsByOrg();
                        this.connected.set(true);
                        this.collectionService.setOptions({
                            headers: {
                                Authorization: 'bearer ' + this.arlasIamService.getAccessToken()
                            }
                        });
                    } else {
                        this.organisations.set([]);
                        this.getCollections();
                        this.connected.set(false);
                        this.collectionService.setOptions({});
                    }
                } else {
                    this.organisations.set([]);
                    this.getCollections();
                    this.connected.set(false);
                    this.collectionService.setOptions({});
                }
            }
        }
    }

    public ngAfterViewInit(): void {
        this.collectionDataSource.paginator = this.paginator;
    }

    public getCollectionsByOrg() {
        this.isLoading = true;
        this.collections.set([]);
        const iamHeader = {
            Authorization: 'Bearer ' + this.arlasIamService.getAccessToken()
        };
        const fetchOptions = { headers: iamHeader };
        this.collabSearchService.setFetchOptions(fetchOptions);
        this.collectionService.getCollectionsReferenceDescription()
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: (crds) => {
                    const collectionsList: CollectionInfos[] = [];
                    crds.forEach((clc: CollectionInfos) => {
                        collectionsList.push(clc);
                    });
                    // remove owner from shared organisations
                    collectionsList
                        .map(c => c.params.organisations.shared = c.params.organisations.shared.filter(o => o !== c.params.organisations.owner));
                    this.collections.set(collectionsList);
                    this.organisations.set(Array.from(new Set(collectionsList.map(c => c.params.organisations.owner))));
                    this.organisationsNames.set(this.organisations());
                    this.collectionDataSource.data = this.collections();
                }
            });
    }

    public getCollections() {
        this.isLoading = true;
        this.collections.set([]);
        this.collectionService.getCollectionsReferenceDescription()
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: (collections) => {
                    this.collections.set(collections.map((c: CollectionInfos) => {
                        c.canEdit = true;
                        return c;
                    }));
                    this.collectionDataSource.data = this.collections();
                }
            });
    }

    public search() {
        this.filterCollections();
    }

    public applyFilters(c: CollectionReferenceDescription) {
        let keepIt = true;

        if (this.authentMode === 'iam') {
            const orgsParam = c.params.organisations;
            // if logged : keep it if collection is shared with at least one of my orgs
            if (this.connected()) {
                keepIt = orgsParam.shared.some(so => this.organisationsNames().includes(so));
            } else { // anonymous : keep collection if it's public
                keepIt = (orgsParam as any).public;
            }

            // filter public collections with toggle state
            if (keepIt && !this.isPublic) {
                keepIt = !(orgsParam as any).public;
            }
        }
        // filter collections with text
        if (keepIt && this.searchValue !== '') {
            keepIt = c.collection_name.includes(this.searchValue) || c.params.display_names.collection.includes(this.searchValue);
        }
        return keepIt;
    }

    public filterCollections() {
        this.collectionDataSource.data = this.collections().filter(c => this.applyFilters(c));
    }

    public openUpdate(collectionName: string) {
        this.router.navigate(['collection', 'edit', collectionName]);
    }

    public sortData(sort: Sort) {
        const data = this.collections().slice();
        if (!sort.active || sort.direction === '') {
            this.collectionDataSource.data = data.filter(c => this.applyFilters(c));

            return;
        } else {
            this.collectionDataSource.data =
                data
                    .filter(c => this.applyFilters(c))
                    .sort((a, b) => {
                        const isAsc = sort.direction === 'asc';
                        switch (sort.active) {
                            case 'collection_name':
                                return this.compareString(a.collection_name, b.collection_name, isAsc);
                            case 'display_name':
                                return this.compareString(a.params.display_names.collection, b.params.display_names.collection, isAsc);
                            case 'owner':
                                return this.compareString(a.params.organisations.owner, b.params.organisations.owner, isAsc);
                            case 'shared_with':
                                return this.compareString(
                                    a.params.organisations.shared.toString(),
                                    b.params.organisations.shared.toString(),
                                    isAsc
                                );
                            case 'is_public':
                                return this.compareNumber(
                                    (a.params.organisations as any).public,
                                    (b.params.organisations as any).public,
                                    isAsc
                                );
                            default:
                                return 0;
                        }
                    });
        }
    }

    private compareString(a: string, b: string, isAsc: boolean) {
        return a.localeCompare(b) * (isAsc ? 1 : -1);
    }

    private compareNumber(a: number, b: number, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
}

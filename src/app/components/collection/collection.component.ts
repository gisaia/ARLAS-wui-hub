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
import { Component, model, OnInit, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CollectionReferenceDescription } from 'arlas-api';
import { UserOrgData } from 'arlas-iam-api';
import {
    ArlasCollaborativesearchService, ArlasIamService,
    ArlasSettingsService, ArlasStartupService, ConfirmModalComponent
} from 'arlas-wui-toolkit';
import { filter, forkJoin, Observable } from 'rxjs';
import { CollectionService } from '../../services/collection.service';
import { Router } from '@angular/router';

@Component({
    selector: 'arlas-collection',
    templateUrl: './collection.component.html',
    styleUrl: './collection.component.scss'
})
export class CollectionComponent implements OnInit {
    public connected: WritableSignal<boolean> = signal(false);
    public organisations: WritableSignal<UserOrgData[]> = signal([]);
    public organisationsNames = model([]);

    public collections: WritableSignal<CollectionReferenceDescription[]> = signal([]);
    public filteredCollections: WritableSignal<CollectionReferenceDescription[]> = signal([]);

    public isAuthentActivated: boolean;
    public authentMode: 'openid' | 'iam';

    public displayedColumns = ['name', 'display_name'];
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
            if (this.authentMode === 'iam') {
                if (!!this.arlasIamService.user) {
                    this.displayedColumns.push(...['owner', 'shared_with', 'is_public']);
                    if (this.arlasIamService.user.roles.some(r => r.name === 'role/arlas/datasets')) {
                        this.displayedColumns.push('action');
                    }
                    this.organisations.set(this.arlasIamService.user.organisations);
                    this.organisationsNames.set(this.organisations().map(o => o.name));
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
            }
        }

    }

    public getCollectionsByOrg() {
        this.collections.set([]);
        const iamHeader = {
            Authorization: 'Bearer ' + this.arlasIamService.getAccessToken()
        };
        const fetchOptions = { headers: iamHeader };
        this.collabSearchService.setFetchOptions(fetchOptions);
        this.collectionService.getCollectionsReferenceDescription()
            .subscribe({
                next: (crds) => {
                    const collectionsList: CollectionReferenceDescription[] = [];
                    crds.forEach(clc => {
                        collectionsList.push(clc);
                    });
                    this.collections.set(collectionsList);
                    this.filteredCollections.set(this.collections());
                }
            });
    }

    public getCollections() {
        this.collections.set([]);
        this.collectionService.getCollectionsReferenceDescription().subscribe({
            next: (collections) => {
                this.collections.set(collections);
                this.filteredCollections.set(this.collections());
            }
        });
    }

    public search() {
        this.filterCollections();
    }

    public applyFilters(c: CollectionReferenceDescription) {
        let keepIt = true;
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
        // filter collections with text
        if (keepIt && this.searchValue !== '') {
            keepIt = c.collection_name.includes(this.searchValue) || c.params.display_names.collection.includes(this.searchValue);
        }
        return keepIt;
    }

    public filterCollections() {
        this.filteredCollections.set(this.collections().filter(c => this.applyFilters(c)));
    }

    public openDelete(collectionName: string) {
        const matDialogRef = this.dialog.open(ConfirmModalComponent, { disableClose: true });
        matDialogRef.componentInstance.confirmHTLMMessage =
            this.translate.instant('Delete the collection: ') + '<strong>' + collectionName + '</strong> ?';
        matDialogRef.afterClosed()
            .pipe(filter(result => result !== false))
            .subscribe(result => {
                this.collectionService.deleteCollection(collectionName).subscribe({
                    next: () => console.log('deleted')
                });
            });

    }

    public openUpdate(collectionName: string) {
        this.router.navigate(['collection', 'edit', collectionName]);
    }

}

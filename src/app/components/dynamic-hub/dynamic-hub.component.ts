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
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Resource } from 'arlas-permissions-api';
import { UserOrgData } from 'arlas-iam-api';
import {
    ActionModalComponent, ArlasIamService, ArlasSettingsService, AuthentificationService, ConfigAction,
    ConfigActionEnum, PermissionService, PersistenceService
} from 'arlas-wui-toolkit';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { Card, CardService } from '../../services/card.service';
import { Action } from '../card/card.component';
import { HubAction, HubActionEnum, HubActionModalComponent } from '../hub-action-modal/hub-action-modal.component';

@Component({
    selector: 'arlas-dynamic-hub',
    templateUrl: './dynamic-hub.component.html',
    styleUrls: ['./dynamic-hub.component.scss']
})
export class DynamicHubComponent implements OnInit {

    @ViewChildren('checkBox') public checkBox: QueryList<any>;

    public action = Action;
    public isLoading = false;
    public cards: Map<string, Card[]>;
    public cardsRef: Map<string, Card[]>;
    public canCreateDashboardByOrg: Map<string, boolean>;
    public allowedOrganisations: string[] = [];

    public cardCollections: Map<string, { color: string; selected: boolean; }> = new Map<string, { color: string; selected: boolean; }>();
    public canCreateDashboard = false;

    public userGroups: string[] = [];

    public selectedCollection: any[] = [];

    public connected;
    public isAuthentActivated;
    public authentMode;
    public orgs: UserOrgData[] = [];
    private orgsSet = new Set<string>();
    public currentOrga = '';
    public PUBLIC_ORG = 'public';

    public constructor(
        private cardService: CardService,
        private dialog: MatDialog,
        private authentService: AuthentificationService,
        private arlasSettingsService: ArlasSettingsService,
        private permissionService: PermissionService,
        private persistenceService: PersistenceService,
        private arlasIamService: ArlasIamService
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
        this.cardCollections.clear();

        if (!this.isAuthentActivated) {
            this.fetchCards();
        } else {
            if (this.authentMode === 'iam') {
                this.arlasIamService.tokenRefreshed$.pipe().subscribe({
                    next: (userSubject) => {
                        if (!!userSubject) {
                            this.connected = true;
                            this.orgs = this.arlasIamService.user.organisations.map(org => {
                                org.displayName = org.name === this.arlasIamService.user.id ?
                                    this.arlasIamService.user.email.split('@')[0] : org.name;
                                return org;
                            });
                            this.orgsSet = new Set(this.orgs.map(o => o.name));
                            this.currentOrga = this.arlasIamService.getOrganisation();
                            this.fetchCards();
                        } else {
                            this.connected = false;
                            this.fetchCards();
                        }
                    }
                });
            } else {
                this.authentService.canActivateProtectedRoutes.subscribe(isConnected => {
                    this.connected = isConnected;
                    if (isConnected) {
                        this.fetchCards();
                    }
                });
                if (!!this.authentService.identityClaims) {
                    this.authentService.loadUserInfo().subscribe(data => {
                        this.userGroups = data.info['http://arlas.io/roles'].filter(r => r.startsWith('group/'))
                            .map(r => r.split('/')[r.split('/').length - 1]);
                    });
                }
            }
        }
    }

    public add(org?: string) {
        if (this.authentMode === 'iam' && this.connected) {

            const iamHeader = {
                Authorization: 'Bearer ' + this.arlasIamService.getAccessToken()
            };
            const options = { headers: iamHeader };
            const action: HubAction = {
                type: HubActionEnum.CREATE,
                orgs: this.orgs.filter(o => this.allowedOrganisations.includes(o.name)),
                options: options
            };
            const dialogRef = this.dialog.open(HubActionModalComponent, {
                disableClose: true,
                data: action
            });

            if (!!org) {
                dialogRef.componentInstance.currentOrga = org;
            }

            dialogRef.afterClosed()
                .pipe(filter(result => result !== false))
                .subscribe(result => {
                    this.fetchCards();
                    let url = this.arlasSettingsService.getArlasBuilderUrl().concat('/load/').concat(result[0]);
                    if (!!result[1]) {
                        url = url.concat(`?org=${result[1]}`);
                    }
                    const win = window.open(url, '_blank');
                    win.focus();
                });

        } else {
            const action: ConfigAction = {
                type: ConfigActionEnum.CREATE,
                config: null
            };
            const dialogRef = this.dialog.open(ActionModalComponent, {
                disableClose: true,
                data: {
                    type: action.type
                }
            });
            dialogRef.afterClosed()
                .pipe(filter(result => result !== false))
                .subscribe(id => {
                    this.fetchCards();
                    const url = this.arlasSettingsService.getArlasBuilderUrl().concat('/load/').concat(id);
                    const win = window.open(url, '_blank');
                    win.focus();
                });
        }

    }

    public import(org?: string) {

        if (this.authentMode === 'iam' && this.connected) {
            const action: HubAction = {
                type: HubActionEnum.IMPORT,
                orgs: this.orgs.filter(o => this.allowedOrganisations.includes(o.name)),
            };
            const dialogRef = this.dialog.open(HubActionModalComponent, {
                disableClose: true,
                data: action
            });
            if (!!org) {
                dialogRef.componentInstance.currentOrga = org;
            }
            dialogRef.afterClosed()
                .pipe(filter(result => result !== false))
                .subscribe(result => {
                    let url = this.arlasSettingsService.getArlasBuilderUrl().concat('/load/import');
                    if (this.arlasIamService.getOrganisation()) {
                        url = url.concat(`?org=${result}`);
                    }
                    const win = window.open(url, '_blank');
                    win.focus();
                });
        } else {
            let url = this.arlasSettingsService.getArlasBuilderUrl().concat('/load/import');
            if (this.arlasIamService.getOrganisation()) {
                url = url.concat(`?org=${this.arlasIamService.getOrganisation()}`);
            }
            const win = window.open(url, '_blank');
            win.focus();
        }
    }

    private fetchCardsByUserOrganisation() {
        let i = 0;
        this.orgs.map(o => o.name).forEach(o => {
            const iamHeader = {
                Authorization: 'Bearer ' + this.arlasIamService.getAccessToken(),
                'arlas-org-filter': o
            };

            const fetchOptions = { headers: iamHeader };

            // Check user rights on each organisation
            this.permissionService.setOptions(fetchOptions);
            this.permissionService.get('persist/resource/')
                .pipe(
                    mergeMap((resources: Resource[]) => {
                        this.canCreateDashboardByOrg.set(o, resources.filter(r => r.verb === 'POST').length > 0);
                        this.allowedOrganisations = this.getAllowedOrganisations();
                        return this.cardService.cardList(fetchOptions)
                            .pipe(map(cards => this.filterCardsByOrganisation(cards, o)))
                            .pipe(tap(cards => this.enrichCards(cards, fetchOptions)));
                    })
                )
                .subscribe({
                    next: (cards) => {
                        cards.map(card => card.actions.filter(a => a.type === ConfigActionEnum.EDIT).map(a =>
                            a.enabled = a.enabled && this.allowedOrganisations.includes(card.organisation)
                        ));
                        this.cardsRef.set(o, cards);
                        i++;
                        this.applyCollectionFilter();
                        if (i === this.orgs.length) {
                            this.isLoading = false;
                        }
                    }
                });
        });
    }

    private fetchAllCards() {
        this.permissionService.get('persist/resource/').subscribe((resources: Resource[]) => {
            this.canCreateDashboard = (resources.filter(r => r.verb === 'POST').length > 0);
        });
        this.cardService.cardList()
            .pipe(tap(cards => this.enrichCards(cards)))
            .subscribe({
                next: (cards) => {
                    this.storeExternalOrganisationsCards(cards);
                    this.isLoading = false;
                    this.applyCollectionFilter();
                }
            });
    }

    private filterCardsByOrganisation(cards: Card[], o?: string) {
        this.storeExternalOrganisationsCards(cards.filter(card => card.organisation !== o));
        return cards.filter(card => card.organisation === o);
    }


    private storeExternalOrganisationsCards(cards: Card[]) {
        cards.forEach(c => {
            if (this.orgsSet.has(c.organisation)) {
                let cardsOfOrga = this.cardsRef.get(c.organisation);
                if (!cardsOfOrga) {
                    cardsOfOrga = [];
                }
                this.addCard(c, cardsOfOrga);
                this.cardsRef.set(c.organisation, cardsOfOrga);
            } else {
                const publicOrg = this.PUBLIC_ORG;
                let publicCards = this.cardsRef.get(publicOrg);
                if (!publicCards) {
                    publicCards = [];
                }
                this.registerCollection(c);
                c.preview$ = this.getPreview$(c.previewId,{});
                this.addCard(c, publicCards);
                this.cardsRef.set(publicOrg, publicCards);
            }
        });
    }

    private addCard(card: Card, cards: Card[]) {
        const cardsSet = new Set(cards.map(c => c.id));
        if (!cardsSet.has(card.id)) {
            cards.push(card);
        }

    }

    private registerCollection(c: Card) {
        if (!this.cardCollections.has(c.collection)) {
            this.cardCollections.set(c.collection, { color: c.color, selected: true });
        }
    }

    private enrichCards(cards: Card[], fetchOptions?): Card[] {
        cards.forEach(c => {
            /** todo concat org ? */
            c.actions.filter(a => a.type === ConfigActionEnum.VIEW)
                .forEach(a => a.url = this.arlasSettingsService.getArlasWuiUrl());
            c.actions.filter(a => a.type === ConfigActionEnum.EDIT)
                .forEach(a => a.url = this.arlasSettingsService.getArlasBuilderUrl().concat('/load/'));
            this.registerCollection(c);
            c.preview$ = this.getPreview$(c.previewId, fetchOptions);
        });
        return cards;
    }

    private getPreview$(previewId: string, fetchOptions?): Observable<string> {
        const assetPreview = 'assets/no_preview.png';
        if (previewId) {
            return this.persistenceService.get(previewId, fetchOptions)
                .pipe(map(p => p.doc_value))
                .pipe(catchError(() => of(assetPreview)));
        }
        return of(assetPreview);
    }

    public fetchCards() {
        this.isLoading = true;
        this.cards = new Map<string, Card[]>();
        this.cardsRef = new Map<string, Card[]>();
        this.canCreateDashboardByOrg = new Map<string, boolean>();
        if (this.authentMode === 'iam' && this.connected) {
            this.fetchCardsByUserOrganisation();
        } else {
            this.fetchAllCards();
        }
    }

    public applyCollectionFilter() {
        if (this.selectedCollection.length > 0) {
            const filteredMap = new Map<string, Card[]>();
            this.cardsRef.forEach((values: Card[], key: string) => {
                filteredMap.set(key, values.filter(c => this.selectedCollection.includes(c.collection)));
            });
            this.cards = filteredMap;
        } else {
            this.cards = this.cardsRef;
        }
    }


    public getCheckbox(state, collectionKey) {
        if (this.selectedCollection.length === 0) {
            this.cardCollections.forEach(v => v.selected = false);
            this.selectedCollection.push(collectionKey);
            this.cardCollections.get(collectionKey).selected = true;
        } else {
            if (state) {
                this.cardCollections.get(collectionKey).selected = true;
                if (!this.selectedCollection.includes(collectionKey)) {
                    this.selectedCollection.push(collectionKey);
                }
                if (this.selectedCollection.length === this.cardCollections.size) {
                    this.selectedCollection = [];
                }
            } else {
                this.selectedCollection = this.selectedCollection.filter(c => c !== collectionKey);
                this.cardCollections.get(collectionKey).selected = false;
                if (this.selectedCollection.length === 0) {
                    this.cardCollections.forEach(v => {
                        v.selected = true;
                    });
                }
            }
        }
        this.cards = this.cardsRef;
        if (this.selectedCollection.length > 0) {
            const filteredMap = new Map<string, Card[]>();
            this.cards.forEach((values: Card[], key: string) => {
                filteredMap.set(key, values.filter(c => this.selectedCollection.includes(c.collection)));
            });
            this.cards = filteredMap;
        }
    }

    public getAllowedOrganisations(): string[] {
        return [...this.canCreateDashboardByOrg.entries()].filter(m => !!m[1]).map(m => m[0]);
    }
}

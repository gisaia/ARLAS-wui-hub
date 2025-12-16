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
import { KeyValue } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserOrgData } from 'arlas-iam-api';
import { Resource } from 'arlas-permissions-api';
import {
    ActionModalComponent, ArlasIamService, ArlasSettingsService, AuthentificationService, ConfigAction,
    ConfigActionEnum, PermissionService, PersistenceService
} from 'arlas-wui-toolkit';
import { catchError, debounceTime, filter, map, mergeMap, Observable, of, tap } from 'rxjs';
import { Card, CardService } from '../../services/card.service';
import { DashboardSearchService } from '../../services/dashboard-search.service';
import { HubAction, HubActionEnum, HubActionModalComponent } from '../hub-action-modal/hub-action-modal.component';

@Component({
    selector: 'arlas-dynamic-hub',
    templateUrl: './dynamic-hub.component.html',
    styleUrls: ['./dynamic-hub.component.scss']
})
export class DynamicHubComponent implements OnInit {

    @ViewChildren('checkBox') public checkBox: QueryList<any>;

    public isLoading = false;
    public cards: Map<string, Card[]>;
    public cardsFiltered: Map<string, Card[]>;
    public searchIndex: string[] = []; // indexId: ;research:;
    public cardsRef: Map<string, Card[]>;
    public allowedOrganisations: string[] = [];

    public canCreateDashboard = false;

    public userGroups: string[] = [];

    public connected = false;
    public isAuthentActivated: boolean;
    public authentMode: 'openid' | 'iam';
    public orgs: UserOrgData[] = [];
    private orgsSet = new Set<string>();
    public currentOrga = '';
    /** Name of the orpublic organisation */
    public readonly PUBLIC_ORG = 'public';
    /** Name of the organisation in a KC deployment for non-public organisations */
    public readonly PRIVATE_NO_ORG = '__no_org__';

    public constructor(
        public readonly cardService: CardService,
        private readonly dialog: MatDialog,
        private readonly authentService: AuthentificationService,
        private readonly arlasSettingsService: ArlasSettingsService,
        private readonly permissionService: PermissionService,
        private readonly persistenceService: PersistenceService,
        private readonly arlasIamService: ArlasIamService,
        private readonly dashboardSearch: DashboardSearchService
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
                this.fetchCards();
                this.authentService.canActivateProtectedRoutes.subscribe(isConnected => {
                    this.connected = isConnected;
                });
            }
        }
        this.initSearch();
    }

    public initSearch() {
        this.dashboardSearch.valueChanged$
            .pipe(
                tap(() => this.isLoading = true),
                debounceTime(500),
                map((v) => {
                    this.filterDashboard(v, true);
                    this.isLoading = false;
                })
            )
            .subscribe({ error: () => this.isLoading = false });
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

    public publicAtTheEnd = (a: KeyValue<string, Card[]>, b: KeyValue<string, Card[]>): number => {
        if (a.key !== this.PUBLIC_ORG && b.key === this.PUBLIC_ORG) {
            return -1;
        }
        if (a.key === this.PUBLIC_ORG && b.key !== this.PUBLIC_ORG) {
            return 1;
        }
        return a.key > b.key ? 1 : (b.key > a.key ? -1 : 0);
    };

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
                        this.cardService.canCreateDashboardByOrg.set(o, resources.filter(r => r.verb === 'POST').length > 0);
                        this.allowedOrganisations = this.getAllowedOrganisations();
                        return this.cardService.cardList(fetchOptions)
                            .pipe(
                                map(cards => this.enrichCards(cards, fetchOptions)),
                                map(cards => this.filterCardsByOrganisation(cards, o))
                            );
                    })
                )
                .subscribe({
                    next: (cards) => {
                        cards.map(card => card.actions.filter(a => a.type === ConfigActionEnum.EDIT).map(a =>
                            a.enabled = a.enabled && this.allowedOrganisations.includes(card.organisation)
                        ));
                        this.cardsRef.set(o, cards);
                        i++;
                        this.initFilter();
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
            this.cardService.canCreateDashboardByOrg.set('', resources.filter(r => r.verb === 'POST').length > 0);
        });
        this.cardService.cardList()
            .pipe(tap(cards => this.enrichCards(cards)))
            .subscribe({
                next: (cards) => {
                    this.groupCardsPerOrganisation(cards);
                    this.isLoading = false;
                    this.initFilter();
                }
            });
    }

    private filterCardsByOrganisation(cards: Card[], o?: string) {
        this.groupCardsPerOrganisation(cards.filter(card => card.organisation !== o));
        return cards.filter(card => card.organisation === o);
    }

    /**
     * For an IAM deployment, group per organisation of the user. The others go in the 'public' organisation.
     * For a KC deployment, two "organisations" are created: the public and non-public cards
     * @param cards
     */
    private groupCardsPerOrganisation(cards: Card[]) {
        cards.forEach(c => {
            if (this.authentMode === 'iam') {
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
                    c.preview$ = this.getPreview$(c.previewId, {});
                    this.addCard(c, publicCards);
                    this.cardsRef.set(publicOrg, publicCards);
                }
            } else {
                const rights = [...c.readers, ...c.writers];
                const fakeOrg = rights.find(g => g.name === 'public') !== undefined ? this.PUBLIC_ORG : this.PRIVATE_NO_ORG;
                let cardsOfOrga = this.cardsRef.get(fakeOrg);
                if (!cardsOfOrga) {
                    cardsOfOrga = [];
                }
                this.addCard(c, cardsOfOrga);
                this.cardsRef.set(fakeOrg, cardsOfOrga);
            }
        });
    }

    private addCard(card: Card, cards: Card[]) {
        const cardsSet = new Set(cards.map(c => c.id));
        if (!cardsSet.has(card.id)) {
            cards.push(card);
        }

    }

    private enrichCards(cards: Card[], fetchOptions?): Card[] {
        cards.forEach(c => {
            /** todo concat org ? */
            c.actions.filter(a => a.type === ConfigActionEnum.VIEW)
                .forEach(a => a.url = this.arlasSettingsService.getArlasWuiUrl());
            c.actions.filter(a => a.type === ConfigActionEnum.EDIT)
                .forEach(a => a.url = this.arlasSettingsService.getArlasBuilderUrl().concat('/load/'));

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
        if (this.authentMode === 'iam' && this.connected) {
            this.fetchCardsByUserOrganisation();
        } else {
            this.fetchAllCards();
        }
    }

    public initFilter() {
        this.cards = this.cardsRef;
        this.dashboardSearch.buildSearchIndex(this.cards);
        this.filterDashboard(this.dashboardSearch.currentFilter, true);
    }

    public filterDashboard(searchValue: string, preserveEmptyCardList = false) {
        let previous;
        if (searchValue) {
            previous = this.cardsFiltered;
            this.cardsFiltered = new Map<string, Card[]>();
            this.dashboardSearch
                .getMatchingSearchIndices()
                .forEach(searchIndex => {
                    if (this.cardsFiltered.has(searchIndex.key)) {
                        this.cardsFiltered.get(searchIndex.key).push(this.cards.get(searchIndex.key)[searchIndex.cardIndex]);
                    } else {
                        this.cardsFiltered.set(searchIndex.key, [this.cards.get(searchIndex.key)[searchIndex.cardIndex]]);
                    }
                });
        } else {
            this.cardsFiltered = this.cards;
        }

        if (preserveEmptyCardList && this.cardsFiltered.size === 0) {
            if (previous) {
                previous.forEach((v, k) => {
                    this.cardsFiltered.set(k, []);
                });
            }
        }
    }

    public getAllowedOrganisations(): string[] {
        return [...this.cardService.canCreateDashboardByOrg.entries()].filter(m => !!m[1]).map(m => m[0]);
    }
}

/*
Licensed to Gisaïa under one or more contributor
license agreements. See the NOTICE.txt file distributed with
this work for additional information regarding copyright
ownership. Gisaïa licenses this file to you under
the Apache License, Version 2.0 (the "License"); you may
not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Resource } from 'arlas-permissions-api';
import { UserOrgData } from 'arlas-iam-api';
import {
    ActionModalComponent, ArlasAuthentificationService, ArlasIamService, ArlasSettingsService, AuthentificationService, ConfigAction,
    ConfigActionEnum, PermissionService, PersistenceService
} from 'arlas-wui-toolkit';
import { filter } from 'rxjs/operators';
import { Card, CardService } from '../../services/card.service';
import { Action } from '../card/card.component';
import { MatSelectChange } from '@angular/material/select';
import { ArlasStartupService } from 'arlas-wui-toolkit';

@Component({
    selector: 'arlas-dynamic-hub',
    templateUrl: './dynamic-hub.component.html',
    styleUrls: ['./dynamic-hub.component.scss']
})
export class DynamicHubComponent implements OnInit {

    @ViewChildren('checkBox') public checkBox: QueryList<any>;

    public action = Action;
    public pageSize = 20;
    public pageNumber = 0;
    public isLoading = false;
    public resultsLength = 0;
    public cards: Card[];
    public cardsRef: Card[];
    public cardCollections: Map<string, { color: string; selected: boolean; }> = new Map<string, { color: string; selected: boolean; }>();
    public canCreateDashboard = false;

    public userGroups: string[] = [];

    public selectedCollection: any[] = [];

    public connected;
    public isAuthentActivated;
    public authentMode = 'false';
    public orgs: UserOrgData[] = [];
    public currentOrga = '';

    public constructor(
        private cardService: CardService,
        private dialog: MatDialog,
        private authentService: AuthentificationService,
        private arlasSettingsService: ArlasSettingsService,
        private permissionService: PermissionService,
        private persistenceService: PersistenceService,
        private arlasIamService: ArlasIamService,
        private startupService: ArlasStartupService,
        private arlasAuthentService: ArlasAuthentificationService
    ) {
        this.isAuthentActivated = !!this.arlasAuthentService.authConfigValue && !!this.arlasAuthentService.authConfigValue.use_authent;
        this.authentMode = this.arlasAuthentService.authConfigValue?.auth_mode;
    }

    public ngOnInit(): void {
        this.permissionService.get('persist/resource/').subscribe((resources: Resource[]) => {
            this.canCreateDashboard = (resources.filter(r => r.verb === 'POST').length > 0);
        });

        if (
            !this.isAuthentActivated
        ) {
            this.fetchCards();
        } else {
            if (this.authentMode === 'iam') {
                this.arlasIamService.tokenRefreshed$.subscribe({
                    next: (userSubject) => {
                        if (!!userSubject) {
                            this.connected = true;
                            this.orgs = this.arlasIamService.user.organisations.map(org => {
                                org.displayName = org.name === this.arlasIamService.user.id ?
                                    this.arlasIamService.user.email.split('@')[0] : org.name;
                                return org;
                            });
                            this.currentOrga = this.arlasIamService.getOrganisation();
                        } else {
                            this.connected = false;
                        }
                        this.fetchCards();
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

    public add() {
        const action: ConfigAction = {
            type: ConfigActionEnum.CREATE,
            config: null
        };
        const dialogRef = this.dialog.open(ActionModalComponent, {
            disableClose: true,
            data: {
                name: action.name,
                type: action.type
            }
        });
        dialogRef.afterClosed()
            .pipe(filter(result => result !== false))
            .subscribe(id => {
                this.fetchCards();
                let url = this.arlasSettingsService.getArlasBuilderUrl().concat('/load/').concat(id);
                if (this.arlasIamService.getOrganisation()) {
                    url = url.concat(`?org=${this.arlasIamService.getOrganisation()}`);
                }
                const win = window.open(url, '_blank');
                win.focus();
            });
    }

    public import() {
        let url = this.arlasSettingsService.getArlasBuilderUrl().concat('/load/import');
        if (this.arlasIamService.getOrganisation()) {
            url = url.concat(`?org=${this.arlasIamService.getOrganisation()}`);
        }
        const win = window.open(url, '_blank');
        win.focus();
    }

    public fetchCards() {
        this.isLoading = true;

        this.cardCollections.clear();
        this.cards = [];
        this.cardService.cardList(
            this.pageSize,
            this.pageNumber + 1,
            this.arlasIamService.getOrganisation()
        ).subscribe(
            (result: [number, Card[]]) => {
                this.resultsLength = result[0];
                this.cards = Array.from(result[1]);
                this.cards.forEach(c => {
                    c.actions.filter(a => a.type === ConfigActionEnum.VIEW)
                        .map(a => a.url = this.arlasSettingsService.getArlasWuiUrl());
                    c.actions.filter(a => a.type === ConfigActionEnum.EDIT)
                        .map(a => a.url = this.arlasSettingsService.getArlasBuilderUrl().concat('/load/'));
                    if (!this.cardCollections.has(c.collection)) {
                        this.cardCollections.set(c.collection, { color: c.color, selected: true });
                    }
                    c.preview = 'assets/no_preview.png';
                    this.persistenceService.existByZoneKey('preview', c.title.concat('_preview')).subscribe(
                        exist => {
                            if (exist.exists) {
                                this.persistenceService.getByZoneKey('preview', c.title.concat('_preview'))
                                    .subscribe(i => c.preview = i.doc_value);
                            }
                        }
                    );
                });
                this.cardsRef = this.cards;
            },
            error => {
                this.isLoading = false;
                console.error(error);
            },
            () => {
                this.isLoading = false;
            }
        );
    }

    public pageChange(pageEvent: PageEvent) {
        this.pageNumber = pageEvent.pageIndex;
        this.pageSize = pageEvent.pageSize;
        this.fetchCards();
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
            this.cards = this.cards.filter(c => this.selectedCollection.includes(c.collection));
        }
    }

    public changeOrg(event: MatSelectChange) {
        this.startupService.changeOrgHeader(event.value, this.arlasIamService.getAccessToken());
        this.fetchCards();
    }

}

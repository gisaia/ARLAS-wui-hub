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
import { Resource } from 'arlas-permissions-api';
import { UserOrgData } from 'arlas-iam-api';
import {
    ActionModalComponent, ArlasIamService, ArlasSettingsService, AuthentificationService, ConfigAction,
    ConfigActionEnum, PermissionService, PersistenceService
} from 'arlas-wui-toolkit';
import { zip } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Card, CardService } from '../../services/card.service';
import { Action } from '../card/card.component';
import { ArlasStartupService } from 'arlas-wui-toolkit';
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

    public cardCollections: Map<string, { color: string; selected: boolean; }> = new Map<string, { color: string; selected: boolean; }>();
    public canCreateDashboard = false;

    public userGroups: string[] = [];

    public selectedCollection: any[] = [];

    public connected;
    public isAuthentActivated;
    public authentMode;
    public orgs: UserOrgData[] = [];
    public currentOrga = '';

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
                        this.permissionService.get('persist/resource/').subscribe((resources: Resource[]) => {
                            this.canCreateDashboard = (resources.filter(r => r.verb === 'POST').length > 0);
                        });
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
        if (this.authentMode === 'iam' && this.connected){
            const iamHeader = {
                Authorization: 'Bearer ' + this.arlasIamService.getAccessToken()
            };
            const options = { headers: iamHeader };
            const action: HubAction = {
                type: HubActionEnum.CREATE,
                orgs: this.orgs,
                options:options
            };
            const dialogRef = this.dialog.open(HubActionModalComponent, {
                disableClose: true,
                data:action
            });
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

        }else{
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

    public import() {

        if (this.authentMode === 'iam' && this.connected){

            const action: HubAction = {
                type: HubActionEnum.IMPORT,
                orgs: this.orgs,
            };
            const dialogRef = this.dialog.open(HubActionModalComponent, {
                disableClose: true,
                data:action
            });
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
        }else{
            let url = this.arlasSettingsService.getArlasBuilderUrl().concat('/load/import');
            if (this.arlasIamService.getOrganisation()) {
                url = url.concat(`?org=${this.arlasIamService.getOrganisation()}`);
            }
            const win = window.open(url, '_blank');
            win.focus();
        }
    }

    public fetchCards() {
        this.isLoading = true;
        this.cardCollections.clear();
        this.cards = new Map<string, Card[]>();
        let getList;
        if (this.authentMode === 'openid' && this.connected) {
            // we dont overide persistence header option with openid
            getList = this.cardService.cardList();
        } else if (this.authentMode === 'iam' && this.connected) {
            // we  overide persistence header option with iam and not pass the organisation
            const iamHeader = {
                Authorization: 'Bearer ' + this.arlasIamService.getAccessToken(),
            };
            getList=this.cardService.cardList({ headers: iamHeader });
        }else{
            getList = this.cardService.cardList();
        }
        getList.subscribe(
            (result: Map<string, Card[]>) => {
                this.cards = result;
                this.cards.forEach(cs => {
                    cs.forEach(c => {
                        c.actions.filter(a => a.type === ConfigActionEnum.VIEW)
                            .map(a => a.url = this.arlasSettingsService.getArlasWuiUrl());
                        c.actions.filter(a => a.type === ConfigActionEnum.EDIT)
                            .map(a => a.url = this.arlasSettingsService.getArlasBuilderUrl().concat('/load/'));
                        if (!this.cardCollections.has(c.collection)) {
                            this.cardCollections.set(c.collection, { color: c.color, selected: true });
                        }
                        c.preview = 'assets/no_preview.png';
                        let options;
                        if (this.authentMode === 'iam' && this.connected){
                            const iamHeader = {
                                Authorization: 'Bearer ' + this.arlasIamService.getAccessToken(),
                            };
                            options={ headers: iamHeader };
                        }
                        if (!!c.previewId) {
                            this.persistenceService.exists(c.previewId).subscribe(
                                exist => {
                                    if (exist.exists) {
                                        this.persistenceService.get(c.previewId)
                                            .subscribe(i => c.preview = i.doc_value);
                                    }
                                }
                            );
                        }
                    });
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
}

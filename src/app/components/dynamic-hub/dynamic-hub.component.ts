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
import {
    ActionModalComponent, ArlasSettingsService, AuthentificationService, ConfigAction,
    ConfigActionEnum, PermissionService, PersistenceService
} from 'arlas-wui-toolkit';
import { filter } from 'rxjs/operators';
import { Card, CardService } from '../../services/card.service';
import { Action } from '../card/card.component';

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

    public constructor(
        private cardService: CardService,
        private dialog: MatDialog,
        private authentService: AuthentificationService,
        private arlasSettingsService: ArlasSettingsService,
        private permissionService: PermissionService,
        private persistenceService: PersistenceService) { }

    public ngOnInit(): void {
        this.permissionService.get('persist/resource').subscribe((resources: Resource[]) => {
            this.canCreateDashboard = (resources.filter(r => r.verb === 'POST').length > 0);
        });

        if (
            !this.arlasSettingsService.getSettings().authentication ||
            (!!this.arlasSettingsService.getSettings().authentication
                && this.arlasSettingsService.getSettings().authentication.force_connect === false)
        ) {
            this.fetchCards();
        } else {
            this.authentService.canActivateProtectedRoutes.subscribe(ready => {
                if (ready) {
                    this.fetchCards();
                }
            });
        }

        if (!!this.authentService.identityClaims) {
            this.authentService.loadUserInfo().subscribe(data => {
                this.userGroups = data.info['http://arlas.io/roles'].filter(r => r.startsWith('group/'))
                    .map(r => r.split('/')[r.split('/').length - 1]);
            });
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
                const url = this.arlasSettingsService.getArlasBuilderUrl().concat('/load/').concat(id);
                const win = window.open(url, '_blank');
                win.focus();
            });
    }

    public import() {
        const url = this.arlasSettingsService.getArlasBuilderUrl().concat('/load/import');
        const win = window.open(url, '_blank');
        win.focus();
    }

    public fetchCards() {
        this.isLoading = true;
        this.cardService.cardList(
            this.pageSize,
            this.pageNumber + 1
        ).subscribe(
            (result: [number, Card[]]) => {
                this.cardCollections.clear();
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

}

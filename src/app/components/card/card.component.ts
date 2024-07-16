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
import { Component, Input, Output, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { ConfigActionEnum, ConfigMenuComponent, NO_ORGANISATION } from 'arlas-wui-toolkit';
import { Subject } from 'rxjs';
import { Card } from '../../services/card.service';
import { ArlasColorService } from 'arlas-web-components';


export enum Action {
    VIEW,
    DELETE,
    EDIT,
    DUPLICATE,
    SHARE
}

export interface CardAction {
    card?: Card;
    action?: Action;
}

@Component({
    selector: 'arlas-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent implements AfterViewInit, OnInit {

    @ViewChild('configMenu', { static: false }) public configMenu: ConfigMenuComponent;
    @Input() public card: Card;
    @Input() public userGroups: string[] = [];
    @Input() public publicOrg = false;
    @Output() public actionOnCard: Subject<CardAction> = new Subject<CardAction>();

    public action = Action;
    public collectionColor = '#000000';
    public status = 'private';
    public NO_ORGANISATION = NO_ORGANISATION;

    public readers: Array<{ name: string; in: boolean; }> = [];
    public writers: Array<{ name: string; in: boolean; }> = [];

    public constructor(
        private colorService: ArlasColorService
    ) {
    }
    public ngOnInit(): void {
        if (!!this.card) {
            this.readers = this.card.readers.map(g => ({
                name: g.name,
                in: this.userGroups.indexOf(g.name) > -1
            }));
            this.writers = this.card.writers.map(g => ({
                name: g.name,
                in: this.userGroups.indexOf(g.name) > -1
            }));

            this.status = this.card.isPublic ? 'public'
                : (this.readers.length === 0 && this.writers.length === 0) ? 'private'
                    : 'shared';
            this.collectionColor = this.colorService.getColor(this.card.collection);
        }

    }

    public ngAfterViewInit() {
        if (!!this.card) {
            const c = Object.assign(this.card.actions);
            this.card.actions = new Array();
            this.card.actions = c;
        }
    }

    public afterAction(e) {
        this.actionOnCard.next(e);
    }

    public clickOnAction(action: Action) {
        this.configMenu.onActionClick(this.card.actions.find(a => a.type === ConfigActionEnum.VIEW));
    }
}

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
import { AfterViewInit, Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfigActionEnum, ConfigMenuComponent } from 'arlas-wui-toolkit';
import { Subject } from 'rxjs';
import { Card } from '../../services/card.service';


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

export interface CardRights {
    name: string;
    right: 'Editor' | 'Viewer';
}

export type DashboardStatus = 'private' | 'shared' | 'public';

@Component({
    selector: 'arlas-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent implements AfterViewInit, OnInit {

    @ViewChild('configMenu', { static: false }) public configMenu: ConfigMenuComponent;
    @Input() public card: Card;
    @Input() public publicOrg = false;
    @Output() public actionOnCard: Subject<CardAction> = new Subject<CardAction>();

    public action = Action;
    public status: DashboardStatus = 'private';
    public NO_ORGANISATION = '';
    public readonly NO_PREVIEW_ASSET = 'assets/no_preview.png';

    public rights: Array<CardRights> = [];

    public constructor() {
    }

    public ngOnInit(): void {
        if (Boolean(this.card)) {
            this.initDashboardWright();
            this.initDashboardVisibility();
        }
    }

    public initDashboardWright() {
        let writers: CardRights[] = [];
        if (this.card && this.card.writers) {
            writers = this.card.writers.map(g => ({
                name: g.name,
                right: 'Editor'
            }));
        }
        let readers: CardRights[] = [];
        if (this.card && this.card.readers) {
            readers = this.card.readers
                .filter(g => !writers.find(w => w.name === g.name))
                .map(g => ({
                    name: g.name,
                    right: 'Viewer'
                }));
        }
        this.rights = [...writers, ...readers];
    }

    public initDashboardVisibility() {
        this.status = this.isPublic(this.rights) ? 'public' : (this.rights.length === 0) ? 'private' : 'shared';
    }

    private isPublic(readers: CardRights[]): boolean {
        return readers.find(g => g.name === 'public') !== undefined;
    }

    public ngAfterViewInit() {
        if (!!this.card) {
            const c = Object.assign(this.card.actions);
            this.card.actions = [];
            this.card.actions = c;
        }
    }

    public afterAction(e) {
        this.actionOnCard.next(e);
    }

    public open() {
        this.configMenu.onActionClick(this.card.actions.find(a => a.type === ConfigActionEnum.VIEW));
    }

    private testregex(n) {
        const toto = Math.floor(Math.random() * n);
        const titi = Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296) * n);
    }

}

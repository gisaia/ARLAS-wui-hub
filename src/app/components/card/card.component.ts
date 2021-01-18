import { Component, Input, Output, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { ArlasColorGeneratorLoader, ConfigActionEnum } from 'arlas-wui-toolkit';
import { Subject } from 'rxjs';
import { Card } from '../../services/card.service';
import { ConfigMenuComponent } from 'arlas-wui-toolkit/components/config-manager/config-menu/config-menu.component';
import { AuthentificationService } from 'arlas-wui-toolkit/services/authentification/authentification.service';


export enum Action {
    VIEW,
    DELETE,
    EDIT,
    DUPLICATE,
    SHARE
}

export interface CardAction {
    card: Card;
    action: Action;
}

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent implements AfterViewInit, OnInit {

    @ViewChild('configMenu', { static: false }) configMenu: ConfigMenuComponent;
    @Input() public card: Card;
    @Input() public userGroups: string[] = [];
    @Output() public actionOnCard: Subject<CardAction> = new Subject<CardAction>();

    public action = Action;
    public collectionColor = '#000000';
    public status = 'private';

    public readers: Array<{ name: string, in: boolean }> = [];
    public writers: Array<{ name: string, in: boolean }> = [];

    constructor(
        private arlasColorGeneratorLoader: ArlasColorGeneratorLoader
    ) {
    }
    public ngOnInit(): void {
        this.readers = this.card.readers.map(g => {
            return {
                name: g.name,
                in: this.userGroups.indexOf(g.name) > -1
            };
        });
        this.writers = this.card.writers.map(g => {
            return {
                name: g.name,
                in: this.userGroups.indexOf(g.name) > -1
            };
        });

        this.status = (this.card.owner === 'anonymous' || this.readers.map(r => r.name).includes('public')
            || this.writers.map(r => r.name).includes('public')) ? 'public'
            : (this.readers.length === 0 && this.writers.length === 0) ? 'private'
                : 'shared';
        this.collectionColor = this.arlasColorGeneratorLoader.getColor(this.card.collection);
    }

    public ngAfterViewInit() {
        const c = Object.assign(this.card.actions);
        this.card.actions = new Array();
        this.card.actions = c;
    }

    public afterAction() {
        this.actionOnCard.next();
    }

    public clickOnAction(action: Action) {
        this.configMenu.onActionClick(this.card.actions.find(a => a.type === ConfigActionEnum.VIEW));
    }
}

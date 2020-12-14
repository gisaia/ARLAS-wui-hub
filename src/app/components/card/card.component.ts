import { Component, Input, Output, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { ArlasColorGeneratorLoader, ConfigActionEnum } from 'arlas-wui-toolkit';
import { Subject } from 'rxjs';
import { Card } from '../../services/card.service';
import { ConfigMenuComponent } from 'arlas-wui-toolkit/components/config-manager/config-menu/config-menu.component';


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
    @Output() public actionOnCard: Subject<CardAction> = new Subject<CardAction>();

    public action = Action;
    public collectionColor = '#000000';
    public status = 'private';

    public readers: string[] = [];
    public writers: string[] = [];

    constructor(
        private arlasColorGeneratorLoader: ArlasColorGeneratorLoader
    ) {
    }
    public ngOnInit(): void {
        this.readers = this.card.readers.map(g => g.name);
        this.writers = this.card.writers.map(g => g.name);

        this.status = (this.card.owner === 'anonymous' || this.readers.includes('public') || this.writers.includes('public')) ? 'public'
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

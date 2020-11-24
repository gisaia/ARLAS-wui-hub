import { Component, Input, Output, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { ArlasColorGeneratorLoader } from 'arlas-wui-toolkit';
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
    card: Card;
    action: Action;
}

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent implements AfterViewInit, OnInit {


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

        this.status = ((this.readers.length === 0 && this.writers.length === 0) || this.card.owner === 'anonymous') ? 'private' :
            (this.readers.includes('public') || this.writers.includes('public')) ? 'public' : 'shared';
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
}

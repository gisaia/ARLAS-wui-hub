import { Component, Input, Output, AfterViewInit, ViewChild } from '@angular/core';
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
export class CardComponent implements AfterViewInit {

  @Input() public card: Card;
  @Output() public actionOnCard: Subject<CardAction> = new Subject<CardAction>();

  public action = Action;
  constructor() {
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

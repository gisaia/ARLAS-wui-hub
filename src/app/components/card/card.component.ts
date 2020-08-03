import { Component, OnInit, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Card } from '../../services/card.service';


export enum Action {
  VIEW,
  DELETE,
  EDIT,
  DUPLICATE,
  SHARE
}

export  interface CardAction{
  card: Card;
  action: Action
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  
  @Input() public card: Card;
  @Output() public actionOnCard: Subject<CardAction> = new Subject<CardAction>();

  public action=Action;
  constructor() { }

  public clickOnAction(action:Action){
      this.actionOnCard.next({
        card: this.card,
        action: action
      })
  }
}

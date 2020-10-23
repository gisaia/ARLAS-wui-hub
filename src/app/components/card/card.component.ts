import { Component, OnInit, Input, Output, AfterViewInit, ViewChild } from '@angular/core';
import { ConfigMenuComponent, ConfigActionEnum } from 'arlas-wui-toolkit/components/config-manager/config-menu/config-menu.component';
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

  @ViewChild('configMenu', {static: false}) configMenu: ConfigMenuComponent;
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

  public clickOnAction(action: Action) {
    this.configMenu.onActionClick(this.card.actions.find(a => a.type === ConfigActionEnum.VIEW));
  }

  public afterAction() {
    this.actionOnCard.next();
  }
}

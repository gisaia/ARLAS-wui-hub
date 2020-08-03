import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-action-modal',
  templateUrl: './action-modal.component.html',
  styleUrls: ['./action-modal.component.scss']
})
export class ActionModalComponent   {

  public action:string;
  public cardName:string;
  public cardId:string;
  public value:string;
  constructor(
    @Inject(MAT_DIALOG_DATA) data) {
        this.cardName = data.cardName;
        this.cardId = data.cardId;
        this.action = data.action;
  }
}



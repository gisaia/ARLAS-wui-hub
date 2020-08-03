import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CardAction, Action } from '../card/card.component';
import { Card } from '../../services/card.service';
import { CardService } from '../../services/card.service';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {  filter } from 'rxjs/operators';
import { ActionModalComponent } from '../action-modal/action-modal.component';
import { LoadService } from '../../services/load.service';
import { AuthentificationService } from 'arlas-wui-toolkit/services/authentification/authentification.service';

@Component({
  selector: 'app-dynamic-hub',
  templateUrl: './dynamic-hub.component.html',
  styleUrls: ['./dynamic-hub.component.scss']
})
export class DynamicHubComponent implements OnInit {

  public action = Action;
  public pageSize = 2;
  public pageNumber = 0;
  public isLoading = false;
  public resultsLength = 0;
  public cards: Card[];

  constructor(private cardService: CardService, 
    private dialog: MatDialog, 
    private loadService: LoadService,
    private authentService: AuthentificationService) { }

  public ngOnInit(): void {
    this.authentService.canActivateProtectedRoutes.subscribe(data =>{
      this.fetchCards();
    })
    
  }

  public onClickToAction(cardAction: CardAction) {
    switch (cardAction.action) {
      case this.action.VIEW: {
        // redirect to arlas-wui-app with config ID; 
        // http://localhost:4200/?config_id=50322281-d279-11ea-9fd1-0242ac160002
        this.openUrl(this.loadService.appData.arlas_wui_url.concat('/?config_id=').concat(cardAction.card.id));
        break;
      }
      case this.action.DELETE: {
        // Open a confirm modal to validate this choice. Available only if updatable is true for this object
        this.getDialogRef(cardAction,'delete').subscribe(id => {
          this.cardService.deleteCard(id).subscribe(data=>this.fetchCards())
        });
        break;
      }
      case this.action.EDIT: {
        // redirect to arlas wui-builer with config ID
        this.openUrl(this.loadService.appData.arlas_wui_builder_url.concat('/load/').concat(cardAction.card.id));
        break;
      }
      case this.action.DUPLICATE: {
        //  Open a modal to enter the name of a new configuration based on the selected one.
        this.getDialogRef(cardAction,'duplicate')
        .subscribe(result => {
          this.cardService.duplicate(result[0],result[1]).subscribe(data=>this.fetchCards(),error=>console.log(error))
        });
        break;
      }
      case this.action.SHARE: {
        // Open a modal to set the permissions read/write for each group
        // call persistence API to retrieve group for the zone
        // open share component
        // select group 
        // update the data with the PUT endpoint of persistence
        break;
      }
      default: {
        console.error('Unknown action');
        break;
      }
    }
  }

  public fetchCards() {
    this.isLoading = true;
    this.cardService.cardList(
      this.pageSize,
      this.pageNumber + 1
    ).subscribe(
      (result: [number,Card[]]) => {
        this.resultsLength = result[0];
        this.cards = Array.from(result[1]);
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

  private getDialogRef(cardAction:CardAction,action:string){
    let dialogRef = this.dialog.open(ActionModalComponent, {
      data: {
        cardName:cardAction.card.title,
        cardId:cardAction.card.id,
        action: action
      }
    });
    return dialogRef.afterClosed().pipe(filter(result=> result !== false))
  }

  public openUrl(url: string) {
    const win = window.open(url, '_blank');
    win.focus();
  }

}

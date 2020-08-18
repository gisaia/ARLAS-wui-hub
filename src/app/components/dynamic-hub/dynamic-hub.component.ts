import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CardAction, Action } from '../card/card.component';
import { Card } from '../../services/card.service';
import { CardService } from '../../services/card.service';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { filter } from 'rxjs/operators';
import { LoadService } from '../../services/load.service';
import { AuthentificationService } from 'arlas-wui-toolkit/services/authentification/authentification.service';
import { ConfigActionEnum, ConfigAction } from 'arlas-wui-toolkit/components/config-manager/config-menu/config-menu.component';
import { ActionModalComponent } from 'arlas-wui-toolkit/components/config-manager/action-modal/action-modal.component';
import { ArlasSettingsService } from 'arlas-wui-toolkit/services/settings/arlas.settings.service';


@Component({
  selector: 'app-dynamic-hub',
  templateUrl: './dynamic-hub.component.html',
  styleUrls: ['./dynamic-hub.component.scss']
})
export class DynamicHubComponent implements OnInit {

  public action = Action;
  public pageSize = 11;
  public pageNumber = 0;
  public isLoading = false;
  public resultsLength = 0;
  public cards: Card[];

  constructor(private cardService: CardService,
    private dialog: MatDialog,
    private loadService: LoadService,
    private authentService: AuthentificationService,
    private arlasSettingsService: ArlasSettingsService) { }

  public ngOnInit(): void {
    this.authentService.canActivateProtectedRoutes.subscribe(data => {
      this.fetchCards();
    })

  }

  public add() {
    const action: ConfigAction = {
      type: ConfigActionEnum.CREATE,
      config:null
    }
    const dialogRef = this.dialog.open(ActionModalComponent, {
      disableClose:true,
      data: {
        name: action.name,
        type: action.type
      }
    });
   dialogRef.afterClosed()
   .pipe(filter(result => result !== false))
   .subscribe(id=>{
     this.fetchCards()
    const url =this.arlasSettingsService.getArlasBuilderUrl().concat('/load/').concat(id);
    const win = window.open(url, '_blank');
    win.focus();
  });
  }

  public fetchCards() {
    this.isLoading = true;
    this.cardService.cardList(
      this.pageSize,
      this.pageNumber + 1
    ).subscribe(
      (result: [number, Card[]]) => {
        this.resultsLength = result[0];
        this.cards = Array.from(result[1]);
        this.cards.forEach(c => {
          c.actions.filter(a => a.type === ConfigActionEnum.VIEW)
          .map(a => a.url = this.arlasSettingsService.getArlasWuiUrl());
          c.actions.filter(a => a.type === ConfigActionEnum.EDIT)
            .map(a => a.url = this.arlasSettingsService.getArlasBuilderUrl().concat('/load/'));
        });
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

}

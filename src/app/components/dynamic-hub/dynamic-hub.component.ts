import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Action } from '../card/card.component';
import { Card } from '../../services/card.service';
import { CardService } from '../../services/card.service';
import { LoadService } from '../../services/load.service';
import { AuthentificationService } from 'arlas-wui-toolkit/services/authentification/authentification.service';
import { ConfigActionEnum } from 'arlas-wui-toolkit/components/config-manager/config-menu/config-menu.component';

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
    private loadService: LoadService,
    private authentService: AuthentificationService) { }

  public ngOnInit(): void {
    this.authentService.canActivateProtectedRoutes.subscribe(data => {
      this.fetchCards();
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
          c.actions.filter(a => a.type === ConfigActionEnum.VIEW).map(a => a.url = this.loadService.appData.arlas_wui_url);
          c.actions.filter(a => a.type === ConfigActionEnum.EDIT)
            .map(a => a.url = this.loadService.appData.arlas_wui_builder_url.concat('/load/'));
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

import { Component } from '@angular/core';
import { LoadService } from '../../services/load.service';

@Component({
  selector: 'app-static-hub',
  templateUrl: './static-hub.component.html',
  styleUrls: ['./static-hub.component.scss']
})
export class StaticHubComponent {

  public cards: any;
  public header: any;
  public footer: any;
  public items: any;

  constructor(private loadService: LoadService){
    this.header = this.loadService.appData.header;
    this.footer = this.loadService.appData.footer;
    this.cards = this.loadService.appData.cards;
    this.items = this.footer.items;
  }

  public navigate(url: string) {
    window.open(url, '_blank');
  }

}

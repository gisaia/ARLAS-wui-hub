import { Component } from '@angular/core';
import { LoadService } from './services/load.service';
import { SidenavService } from './services/sidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public onSideNavChange: boolean;
  public useStatic: boolean;

  constructor(private loadService: LoadService,
    private sidenavService: SidenavService) {
    this.useStatic = this.loadService.appData.static;
    this.sidenavService.sideNavState.subscribe(res => {
      this.onSideNavChange = res;
    });
  }
}

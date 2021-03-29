import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ArlasSettingsService } from 'arlas-wui-toolkit/services/settings/arlas.settings.service';
import { LoadService } from './services/load.service';
import { SidenavService } from './services/sidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public onSideNavChange: boolean;
  public useStatic: boolean;
  public title = 'ARLAS-wui-hub';

  constructor(private loadService: LoadService,
    private sidenavService: SidenavService,
    private titleService: Title,
    private arlasSettingsService: ArlasSettingsService) {
    this.useStatic = this.loadService.appData.static;
    this.sidenavService.sideNavState.subscribe(res => {
      this.onSideNavChange = res;
    });
  }
  public ngOnInit(): void {
    // tslint:disable-next-line:no-string-literal
    this.title = this.arlasSettingsService.settings['tab_name'] ?
      // tslint:disable-next-line:no-string-literal
      this.arlasSettingsService.settings['tab_name'] : 'ARLAS-wui-hub';
    this.titleService.setTitle(this.title);
  }
}

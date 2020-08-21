import { Component, OnInit } from '@angular/core';
import { onSideNavChange, animateText } from './animations';
import { AuthentificationService } from 'arlas-wui-toolkit/services/authentification/authentification.service';
import { Router } from '@angular/router';
import { UserInfosComponent } from 'arlas-wui-toolkit//components/user-infos/user-infos.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SidenavService } from '../../services/sidenav.service';

interface Page {
  link: string;
  name: string;
  icon: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
  animations: [onSideNavChange, animateText]
})
export class LeftMenuComponent implements OnInit {

  public sideNavState = false;
  public linkText = false;
  public connected: boolean;
  public pages: Page[] = [];
  public name: string;
  public avatar: string;
  public reduce: string;
  public expand: string;
  public isLabelDisplayed = false;

  constructor(private authentService: AuthentificationService, private router: Router,
    private dialog: MatDialog, private translate: TranslateService, private sidenavService: SidenavService) {
    this.reduce = this.translate.instant('reduce');
    this.expand = this.translate.instant('expand');

  }

  public ngOnInit() {
    const claims = this.authentService.identityClaims as any;
    this.authentService.canActivateProtectedRoutes.subscribe(isConnected => {
      this.connected = isConnected;
      if (isConnected) {
        this.name = claims.nickname;
        this.avatar = claims.picture;
      } else {
        this.name = '';
        this.avatar = '';
      }
    });
  }

  public connect() {
    if (this.connected) {
      this.authentService.logout();
    } else {
      this.authentService.login();
    }
  }

  public getUserInfos() {
    this.dialog.open(UserInfosComponent);
  }

  public expandMenu() {
    this.isLabelDisplayed = !this.isLabelDisplayed;
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }
}

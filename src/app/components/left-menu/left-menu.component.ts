/*
Licensed to Gisaïa under one or more contributor
license agreements. See the NOTICE.txt file distributed with
this work for additional information regarding copyright
ownership. Gisaïa licenses this file to you under
the Apache License, Version 2.0 (the "License"); you may
not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfosComponent, AuthentificationService } from 'arlas-wui-toolkit';
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
  selector: 'arlas-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss']
})
export class LeftMenuComponent implements OnInit {

  public sideNavState = false;
  public linkText = false;
  public connected;
  public isAuthentActivated;
  public pages: Page[] = [];
  public name: string;
  public avatar: string;
  public reduce: string;
  public expand: string;
  public isLabelDisplayed = false;

  public constructor(private authentService: AuthentificationService, private router: Router,
    private dialog: MatDialog, private translate: TranslateService, private sidenavService: SidenavService) {
    this.reduce = this.translate.instant('reduce');
    this.expand = this.translate.instant('expand');
    this.isAuthentActivated = !!this.authentService.authConfigValue && !!this.authentService.authConfigValue.use_authent;
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

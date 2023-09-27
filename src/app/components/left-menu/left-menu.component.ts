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
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ArlasAuthentificationService, ArlasIamService, AuthentificationService, UserInfosComponent } from 'arlas-wui-toolkit';

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
    public authentMode = 'false';
    public pages: Page[] = [];
    public name: string;
    public avatar: string;
    public reduce: string;
    public expand: string;
    public isLabelDisplayed = false;

    public constructor(
        private authentService: AuthentificationService,
        private router: Router,
        private dialog: MatDialog,
        private translate: TranslateService,
        private arlasIamService: ArlasIamService,
        private arlasAuthentService: ArlasAuthentificationService
    ) {
        this.reduce = this.translate.instant('reduce');
        this.expand = this.translate.instant('expand');
        this.isAuthentActivated = !!this.arlasAuthentService.authConfigValue && !!this.arlasAuthentService.authConfigValue.use_authent;
        this.authentMode = this.arlasAuthentService.authConfigValue?.auth_mode;
    }

    public ngOnInit() {
        if (this.authentMode === 'openid') {
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
        if (this.authentMode === 'iam') {
            this.arlasIamService.tokenRefreshed$.subscribe({
                next: (data) => {
                    if (!!data) {
                        this.connected = true;
                        this.name = data?.user.email;
                        this.avatar = this.getInitials(this.name);
                    } else {
                        this.connected = false;
                        this.name = '';
                        this.avatar = '';
                    }
                },
                error: () => {
                    this.connected = false;
                }
            });
        }
    }

    public connect() {
        if (this.authentMode === 'openid') {
            if (this.connected) {
                this.authentService.logout();
            } else {
                this.authentService.login();
            }
        }
        if (this.authentMode === 'iam') {
            if (this.connected) {
                this.arlasIamService.logout(['/']);
            } else {
                this.router.navigate(['login']);
            }
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

    public getInitials(name) {

        const canvas = document.createElement('canvas');
        canvas.style.display = 'none';
        canvas.width = 32;
        canvas.height = 32;
        document.body.appendChild(canvas);

        const context = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 16;
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = '#999';
        context.fill();
        context.font = '16px Arial';
        context.fillStyle = '#eee';

        if (name && name !== '') {
            const first = name[0];
            context.fillText(first.toUpperCase(), 10, 23);
            const data = canvas.toDataURL();
            document.body.removeChild(canvas);
            return data;
        } else {
            return '';
        }
    }
}

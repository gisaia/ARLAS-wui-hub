/*
 * Licensed to Gisaïa under one or more contributor
 * license agreements. See the NOTICE.txt file distributed with
 * this work for additional information regarding copyright
 * ownership. Gisaïa licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatTooltip } from '@angular/material/tooltip';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MarkerModule } from '@colsen1991/ngx-translate-extract-marker/extras';
import { TranslatePipe } from '@ngx-translate/core';
import { ArlasSettingsService, ArlasToolkitSharedModule } from 'arlas-wui-toolkit';
import { filter, Subject, takeUntil } from 'rxjs';
import { environment } from '../environments/environment';
import { DashboardSearchComponent } from './components/dashboard-search/dashboard-search.component';
import { LeftMenuComponent } from './components/left-menu/left-menu.component';
import { SidenavService } from './services/sidenav.service';

@Component({
    selector: 'arlas-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        ArlasToolkitSharedModule, MatTooltip, RouterLink, NgIf, DashboardSearchComponent, MatDivider,
        MatSidenavContainer, MatSidenav, LeftMenuComponent, MatSidenavContent, RouterOutlet, MarkerModule, TranslatePipe]
})
export class AppComponent implements OnInit, OnDestroy {

    public onSideNavChange: boolean;
    public title = 'ARLAS-wui-hub';
    public displayMenu = true;
    public displaySearchBar = true;
    public version: string;

    private readonly _onDestroy$ = new Subject<boolean>();

    public constructor(
        private readonly sidenavService: SidenavService,
        private readonly titleService: Title,
        private readonly arlasSettingsService: ArlasSettingsService,
        private readonly router: Router
    ) {
        this.sidenavService.sideNavState?.subscribe(res => {
            this.onSideNavChange = res;
        });
    }
    public ngOnInit(): void {
        this.title = this.arlasSettingsService.settings['tab_name'] ?? 'ARLAS-wui-hub';
        this.titleService.setTitle(this.title);
        this.version = environment.VERSION;

        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntil(this._onDestroy$))
            .subscribe(
                (data: NavigationEnd) => {
                    this.displayMenu = data.url !== '/login'
                        && data.url !== '/register'
                        && data.url !== '/password_forgot'
                        && data.url !== '/verify/'
                        && data.url !== '/reset/';
                    this.displaySearchBar = this.displayMenu && !data.url.includes('/collection');
                }
            );
    }

    public ngOnDestroy(): void {
        this._onDestroy$.next(true);
        this._onDestroy$.complete();
    }
}

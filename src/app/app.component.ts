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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { ArlasSettingsService } from 'arlas-wui-toolkit';
import { filter, Subject, takeUntil } from 'rxjs';
import { environment } from '../environments/environment';
import { SidenavService } from './services/sidenav.service';

@Component({
    selector: 'arlas-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    public onSideNavChange: boolean;
    public title = 'ARLAS-wui-hub';
    public displayMenu = true;
    public displaySearchBar = true;
    public version: string;

    private _onDestroy$ = new Subject<boolean>();

    public constructor(
        private sidenavService: SidenavService,
        private titleService: Title,
        private arlasSettingsService: ArlasSettingsService,
        private router: Router
    ) {
        this.sidenavService.sideNavState?.subscribe(res => {
            this.onSideNavChange = res;
        });
    }
    public ngOnInit(): void {
        this.title = this.arlasSettingsService.settings['tab_name'] ?
            this.arlasSettingsService.settings['tab_name'] : 'ARLAS-wui-hub';
        this.titleService.setTitle(this.title);
        this.version = environment.VERSION;

        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntil(this._onDestroy$))
            .subscribe(
                (data) => {
                    this.displayMenu = (data as NavigationEnd).url !== '/login'
                        && (data as NavigationEnd).url !== '/register'
                        && (data as NavigationEnd).url !== '/password_forgot'
                        && (data as NavigationEnd).url !== '/verify/'
                        && (data as NavigationEnd).url !== '/reset/';
                    this.displaySearchBar = this.displayMenu && !(data as NavigationEnd).url.includes('/collection');
                }
            );
    }

    public ngOnDestroy(): void {
        this._onDestroy$.next(true);
        this._onDestroy$.complete();
    }
}

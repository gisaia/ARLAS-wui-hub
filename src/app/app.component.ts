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
import { Title } from '@angular/platform-browser';
import { ArlasSettingsService } from 'arlas-wui-toolkit';
import { LoadService } from './services/load.service';
import { SidenavService } from './services/sidenav.service';

@Component({
    selector: 'arlas-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public onSideNavChange: boolean;
    public useStatic: boolean;
    public title = 'ARLAS-wui-hub';

    public constructor(private loadService: LoadService,
        private sidenavService: SidenavService,
        private titleService: Title,
        private arlasSettingsService: ArlasSettingsService) {
        this.useStatic = this.loadService.appData?.static;
        this.sidenavService.sideNavState?.subscribe(res => {
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

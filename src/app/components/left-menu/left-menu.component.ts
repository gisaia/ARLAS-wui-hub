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
import { Component, OnInit } from '@angular/core';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';

interface Page {
    link: string;
    name: string;
    icon: string;
    disabled?: boolean;
}

@Component({
    selector: 'arlas-left-menu',
    templateUrl: './left-menu.component.html',
    styleUrls: ['./left-menu.component.scss'],
    standalone: false
})
export class LeftMenuComponent implements OnInit {

    public sideNavState = false;
    public linkText = false;
    public pages: Page[] = [];
    public reduce: string;
    public expand: string;
    public isLabelDisplayed = false;

    public constructor(private translate: TranslateService) {
        this.reduce = this.translate.instant('reduce');
        this.expand = this.translate.instant('expand');
    }

    public ngOnInit() {
        this.pages = [
            {
                link: 'dashboard',
                name: marker('Dashboards'),
                icon: 'dashboard'
            },
            {
                link: 'collection',
                name: marker('Collections'),
                icon: 'library_books'
            }
        ];
    }

    public expandMenu() {
        this.isLabelDisplayed = !this.isLabelDisplayed;
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    }
}

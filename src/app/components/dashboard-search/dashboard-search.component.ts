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

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, Subscription } from 'rxjs';
import { DashboardSearchService } from '../../services/dashboard-search.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'arlas-dashboard-search',
    templateUrl: './dashboard-search.component.html',
    styleUrls: ['./dashboard-search.component.scss']
})
export class DashboardSearchComponent implements OnInit, OnDestroy{

    @Input() public searchPlaceholder: string;
    public searchValue = '';

    /**
     * @description Form for the search
     */
    public searchCtrl: FormControl = new FormControl<string>(null);
    private _searchSub: Subscription;

    public constructor(
        private dashboardSearchService: DashboardSearchService
    ) {
        this.searchValue = this.dashboardSearchService.currentFilter;
        this.searchCtrl.setValue(this.searchValue);
    }

    public ngOnInit(): void {
        this._searchSub = this.searchCtrl.valueChanges.pipe(
            debounceTime(400),
            filter(v => v !== null ),
            map((v: string) =>  this.search(v))
        ).subscribe();
    }

    public search(value: any){
        this.searchValue = value;
        this.dashboardSearchService.emit(value);
    }

    public clearSearch() {
        this.searchCtrl.reset();
        this.dashboardSearchService.emit('');
    }

    public ngOnDestroy(): void {
        this._searchSub.unsubscribe();
    }
}

import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter } from 'rxjs';
import { DashboardSearchService } from '../../services/dashboard-search.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'arlas-dashboard-search',
    templateUrl: './dashboard-search.component.html',
    styleUrls: ['./dashboard-search.component.scss']
})
export class DashboardSearchComponent implements OnInit{

    /**
     * @Input : Angular
     * @description Value of the search filter
     */
    public searchValue = '';
    @Input() public searchPlaceholder: string;

    /**
     * @description Form for the search
     */
    public searchCtrl: FormControl = new FormControl<string>(null);


    public constructor(
        private dashboardSearchService: DashboardSearchService
    ) {
        this.searchValue = this.dashboardSearchService.currentFilter;
        this.searchCtrl.setValue(this.searchValue);
    }

    public ngOnInit(): void {
        this.searchCtrl.valueChanges.pipe(
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
}

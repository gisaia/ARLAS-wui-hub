import { Injectable } from '@angular/core';
import { Card } from './card.service';
import { Subject } from 'rxjs';

export interface SearchIndexDashboard {
    key: string;
    cardIndex: string;
    search: string;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardSearchService {
    /**
     * url we expect to find if there is a filter
     */
    public readonly URL_PARAMS = 'filter_hub_dashboard';
    /**
     *  Hold the string to filter the cards
     */
    public searchIndex: string[] = [];
    public valueChanged$ = new Subject<string>();
    private _currentValue = '';

    get currentFilter(){
        return this._currentValue;
    }
    public constructor() {
        this.retrieveParamsFromUrl();
    }

    public emit(value: string){
        this._currentValue = value;
        this._updateUrl();
        this.valueChanged$.next(this._currentValue);
    }

    private _updateUrl(){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let query = '';
        if(this._currentValue) {
            urlParams.set(this.URL_PARAMS, this._currentValue);
            query = `?${urlParams.toString()}`;
        } else {
            urlParams.delete(this.URL_PARAMS);
        }
        window.history.replaceState(null, '', query);
    }

    public retrieveParamsFromUrl(){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        this._currentValue = urlParams.get(this.URL_PARAMS);
        return this._currentValue ?? null;
    }

    public getMatchingSearchIndexes(): SearchIndexDashboard[]{
        return this.searchIndex
            .filter(s => {
                const search = s.split(';search:')[1];
                const keyword = this.splitSearchToKeywords(this._currentValue);
                return keyword.every((v) => search.includes(v.toLowerCase().trim()));
            })
            .map((searchIndex) => {
                const parts = searchIndex.split(';');
                const key = parts[0].split(':')[1];
                const cardIndex = parts[1].split(':')[1];
                const search = parts[2].split(':')[1];
                return {key, cardIndex, search};
            });
    }

    public splitSearchToKeywords(value: string){
        if(value && value.length > 1){
            return value.split(' ');
        }
        return [];
    }

    public buildSearchIndex(cards: Map<string, Card[]>){
        this.searchIndex = [];
        cards.forEach((values: Card[], key: string) => {
            values.forEach((c,i) => {
                const s = `${c.title.toLowerCase().replace(/\s/g, '')}${(c?.organisation) ? c.organisation : '' }`;
                const searchIndex = `searchIndex:${key};i:${i};search:${s}`;
                this.searchIndex.push(searchIndex);
            });
        });
    }
}

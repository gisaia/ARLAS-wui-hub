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
import { Injectable } from '@angular/core';
import {
    CollectionReference,
    CollectionReferenceDescription,
    CollectionReferenceUpdateOrg,
    CollectionsApi,
    Configuration,
    ExploreApi,
    Success
} from 'arlas-api';
import { ArlasCollaborativesearchService } from 'arlas-wui-toolkit';
import { from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CollectionService {

    public arlasCollectionsApi: CollectionsApi;
    public arlasExploreApi: ExploreApi;
    public options;

    public constructor(
        private collabSearchService: ArlasCollaborativesearchService
    ) {
        const configuration: Configuration = new Configuration();
        const arlasExploreApi: ExploreApi = new ExploreApi(
            configuration,
            'http://localhost/arlas',
            window.fetch
        );
        const arlasCollectionApi: CollectionsApi = new CollectionsApi(
            configuration,
            'http://localhost/arlas',
            window.fetch
        );
        this.arlasCollectionsApi = arlasCollectionApi;
        this.arlasExploreApi = arlasExploreApi;
        this.collabSearchService.setExploreApi(this.arlasExploreApi);
    }

    public getOptions() {
        return this.options;
    }

    public setOptions(options): void {
        this.options = options;
    }

    public getCollectionsReferenceDescription(): Observable<CollectionReferenceDescription[]> {
        return this.collabSearchService.list();
    }

    public getCollectionReference(collectionName: string, options = this.options): Observable<CollectionReference> {
        return from(this.arlasCollectionsApi.get(collectionName, false, options));
    }

    public deleteCollection(name: string, options = this.options): Observable<Success> {
        return from(this.arlasCollectionsApi._delete(name, false, options));
    }

    public updateFields(fields: { [key: string]: string; }, collection: string, options = this.options) {
        return from(this.arlasCollectionsApi.patchFieldsDisplayNames(fields, collection, false, options));
    }

    public updateCollectionDisplayName(displayName: string, collection: string, options = this.options) {
        return from(this.arlasCollectionsApi.patchCollectionDisplayName(displayName, collection, false, options));
    }

    public updateCollectionOrg(collectionOrg: CollectionReferenceUpdateOrg, collection: string, options = this.options) {
        return from(this.arlasCollectionsApi.patch(collectionOrg, collection, false, options));
    }
}

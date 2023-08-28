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
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataResource, DataWithLinks } from 'arlas-persistence-api';
import { Injectable } from '@angular/core';
import { Config, ConfigAction, ConfigActionEnum, PersistenceService } from 'arlas-wui-toolkit';
import { ArlasColorService } from 'arlas-web-components';



export interface Group {
    fullname: string;
    name: string;
    color: string;
}
export interface Card {
    id: string;
    title: string;
    readers: Group[];
    writers: Group[];
    updatable: boolean;
    last_update_date: Date;
    tabs?: string[];
    collection?: string;
    actions: Array<ConfigAction>;
    color: string;
    owner: string;
    preview?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CardService {

    public constructor(private persistenceService: PersistenceService,
        private colorService: ArlasColorService) {
    }

    public cardList(size: number, page: number, org: string): Observable<[number, Card[]]> {
        return (this.persistenceService.list('config.json', size, page, 'desc') as Observable<DataResource>)
            .pipe(map(data => {
                if (data.data !== undefined) {
                    return [data.total, data.data.map(d => this.dataWithlinksToCards(d, org))];
                } else {
                    return [data.total, []];
                }
            }));
    }

    private dataWithlinksToCards(data: DataWithLinks, org: string): Card {
        const actions: Array<ConfigAction> = new Array();
        const config: Config = {
            id: data.id,
            name: data.doc_key,
            value: data.doc_value,
            readers: data.doc_readers,
            writers: data.doc_writers,
            lastUpdate: +data.last_update_date,
            zone: data.doc_zone,
            org: org
        };
        actions.push({
            config: config,
            configIdParam: 'config_id',
            type: ConfigActionEnum.VIEW
        });
        actions.push({
            config: config,
            type: ConfigActionEnum.EDIT,
            enabled: data.updatable
        });
        actions.push({
            config: config,
            type: ConfigActionEnum.RENAME,
            name: data.doc_key,
            enabled: data.updatable
        });
        actions.push({
            config: config,
            type: ConfigActionEnum.DUPLICATE,
            name: data.doc_key
        });
        actions.push({
            config: config,
            type: ConfigActionEnum.SHARE,
            enabled: data.updatable

        });
        actions.push({
            config: config,
            type: ConfigActionEnum.DELETE,
            enabled: data.updatable
        });
        const readers = new Array<Group>();
        if (data.doc_readers) {
            data.doc_readers.forEach(r => {
                const reader: Group = {
                    fullname: r,
                    name: r.split('/')[r.split('/').length - 1],
                    color: this.colorService.getColor(r)
                };
                readers.push(reader);
            });
        }
        const writers = new Array<Group>();
        if (data.doc_writers) {
            data.doc_writers.forEach(r => {
                const writer: Group = {
                    fullname: r,
                    name: r.split('/')[r.split('/').length - 1],
                    color: this.colorService.getColor(r)
                };
                writers.push(writer);
            });
        }
        return {
            id: data.id,
            title: data.doc_key,
            readers,
            writers,
            updatable: data.updatable,
            last_update_date: data.last_update_date,
            tabs: this.getTabs(data.doc_value),
            collection: this.getCollection(data.doc_value),
            actions: actions,
            color: this.colorService.getColor(this.getCollection(data.doc_value)),
            owner: data.doc_owner
        };
    }

    private getTabs(value: string): string[] {
        const config: any = JSON.parse(value);
        if (config.arlas !== undefined &&
            config.arlas.web !== undefined &&
            config.arlas.web.analytics !== undefined) {
            const tabs: Set<string> = new Set(config.arlas.web.analytics
                .filter(a => a.tab !== undefined).map(a => a.tab));
            return Array.from(tabs);
        } else {
            return [];
        }
    }

    private getCollection(value: string): string {
        const config: any = JSON.parse(value);
        if (!!config.arlas && !!config.arlas.server && !!config.arlas.server.collection) {
            return config.arlas.server.collection.name;
        } else {
            return 'no_collection';
        }
    }

}

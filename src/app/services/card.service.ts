import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { ConfigAction, ConfigActionEnum, Config } from 'arlas-wui-toolkit';
import { DataResource, DataWithLinks } from 'arlas-persistence-api';
import { Injectable } from '@angular/core';
import { PersistenceService } from 'arlas-wui-toolkit/services/persistence/persistence.service';



export interface Card {
  id: string;
  title: string;
  readers: string[];
  writers: string[];
  updatable: boolean;
  last_update_date: Date;
  actions: Array<ConfigAction>;
}

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private persistenceService: PersistenceService) {

  }

  public cardList(size: number, page: number): Observable<[number, Card[]]> {
    return (this.persistenceService.list('config.json', size, page, 'asc') as Observable<DataResource>)
      .pipe(filter(data => data.data !== undefined), map(data => [data.total, data.data.map(d => this.dataWithlinksToCards(d))]));
  }

  private dataWithlinksToCards(data: DataWithLinks): Card {
    const actions: Array<ConfigAction> = new Array();
    const config: Config = {
      id: data.id,
      name: data.doc_key,
      value: data.doc_value,
      readers: data.doc_readers,
      writers: data.doc_writers,
      lastUpdate: +data.last_update_date,
      zone: data.doc_zone
    };
    actions.push({
      config,
      configIdParam: 'config_id',
      type: ConfigActionEnum.VIEW
    });
    actions.push({
      config,
      type: ConfigActionEnum.EDIT,
      enabled: data.updatable
    });
    actions.push({
      config,
      type: ConfigActionEnum.DUPLICATE,
      name: data.doc_key
    });
    actions.push({
      config,
      type: ConfigActionEnum.DELETE,
      enabled: data.updatable
    });
    actions.push({
      config,
      type: ConfigActionEnum.SHARE
    });
    return {
      id: data.id,
      title: data.doc_key,
      readers: data.doc_readers,
      writers: data.doc_writers,
      updatable: data.updatable,
      last_update_date: data.last_update_date,
      actions
    };
  }
}

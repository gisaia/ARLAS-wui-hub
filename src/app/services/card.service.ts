import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { ConfigAction, ConfigActionEnum } from 'arlas-wui-toolkit/components/config-manager/config-menu/config-menu.component';
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
    actions.push({
      configId: data.id,
      configIdParam: 'config_id',
      type: ConfigActionEnum.VIEW,
      name: data.doc_key
    });
    actions.push({
      configId: data.id,
      type: ConfigActionEnum.EDIT,
      name: data.doc_key,
      enabled: data.updatable
    });
    actions.push({
      configId: data.id,
      type: ConfigActionEnum.DUPLICATE,
      name: data.doc_key
    });
    actions.push({
      configId: data.id,
      type: ConfigActionEnum.DELETE,
      name: data.doc_key,
      enabled: data.updatable
    });
    actions.push({
      configId: data.id,
      type: ConfigActionEnum.SHARE,
      name: data.doc_key
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

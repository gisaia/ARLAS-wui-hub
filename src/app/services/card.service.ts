import { Observable } from 'rxjs';
import { map, filter, flatMap } from 'rxjs/operators';
import { ConfigAction, ConfigActionEnum, Config } from 'arlas-wui-toolkit/components/config-manager/config-menu/config-menu.component';
import { DataResource, DataWithLinks } from 'arlas-persistence-api';
import { Injectable } from '@angular/core';
import { PersistenceService } from 'arlas-wui-toolkit/services/persistence/persistence.service';
import { ArlasColorGeneratorLoader } from 'arlas-wui-toolkit/services/color-generator-loader/color-generator-loader.service';



export interface Card {
  id: string;
  title: string;
  readers: string[];
  writers: string[];
  updatable: boolean;
  last_update_date: Date;
  tabs?: string[];
  actions: Array<ConfigAction>;
  color:string;
}

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private persistenceService: PersistenceService, 
    private arlasColorGeneratorLoader:ArlasColorGeneratorLoader){
  }

  public cardList(size: number, page: number): Observable<[number, Card[]]> {
    return (this.persistenceService.list('config.json', size, page, 'asc') as Observable<DataResource>)
      .pipe(map(data => {
        if(data.data !== undefined){
          return  [data.total, data.data.map(d => this.dataWithlinksToCards(d))]
        }else{
          return [data.total, []]
        }
      }));
  }

  public deleteCard(id: string): Observable<Card> {
    return this.persistenceService.delete(id).pipe(map(d => this.dataWithlinksToCards(d)));
  }

  public createEmpty(name: string): Observable<DataWithLinks> {
    return this.persistenceService.create('config.json', name, '{}');
  }

  public duplicate(newName: string, id: string): Observable<DataWithLinks> {
    return this.persistenceService.get(id)
      .pipe(flatMap(data => {
        return this.persistenceService.create('config.json', newName, data.doc_value, data.doc_readers, data.doc_writers)
      }))
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
      type: ConfigActionEnum.SHARE
    });
    actions.push({
      config,
      type: ConfigActionEnum.DELETE,
      enabled: data.updatable
    });
    return {
      id: data.id,
      title: data.doc_key,
      readers: data.doc_readers,
      writers: data.doc_writers,
      updatable: data.updatable,
      last_update_date: data.last_update_date,
      tabs: this.getTabs(data.doc_value),
      actions: actions,
      color : this.arlasColorGeneratorLoader.getColor(data.id.concat(data.doc_key))
    }
  }

  private getTabs(value: string): string[] {
    const config: any = JSON.parse(value);
    if (config.arlas !== undefined &&
      config.arlas.web !== undefined &&
      config.arlas.web.analytics !== undefined) {
      return config.arlas.web.analytics
        .filter(a => a.tabs !== undefined).map(a => a.tabs)
    } else {
      return [];
    }
  };

}

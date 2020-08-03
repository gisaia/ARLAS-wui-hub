import { LoadService } from './load.service';
import { from, Observable, throwError } from 'rxjs';
import { map, filter, flatMap } from 'rxjs/operators';

import { Configuration, DataResource, DataWithLinks, PersistApi } from 'arlas-persistence-api';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { PersistenceService } from 'arlas-wui-toolkit/services/persistence/persistence.service'



export interface Card {
  id: string;
  title: string;
  readers: string[];
  writers: string[];
  updatable: boolean;
  last_update_date: Date;
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

  public deleteCard(id: string): Observable<Card> {
    return this.persistenceService.delete(id).pipe(map(d => this.dataWithlinksToCards(d)));
  }

  public duplicate(newName: string, id: string): Observable<DataWithLinks> {
    console.log(newName);
    console.log(id);

    return this.persistenceService.get(id).pipe(flatMap(data => {
      return this.persistenceService.create('config.json', newName, data.doc_value, data.doc_readers, data.doc_writers)
    }))
  }

  private dataWithlinksToCards(data: DataWithLinks): Card {
    return {
      id: data.id,
      title: data.doc_key,
      readers: data.doc_readers,
      writers: data.doc_writers,
      updatable: data.updatable,
      last_update_date: data.last_update_date
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoadService {

  public appData: any;

  constructor(private http: HttpClient) {
  }

  public load(config: string): Promise<any> {
    return this.http
      .get(config)
      .toPromise()
      .then(response => this.appData = response)
      .catch(error => {
        console.log(error);
      });
  }
}

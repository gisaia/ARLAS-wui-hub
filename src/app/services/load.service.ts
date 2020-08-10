import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArlasStartupService, ArlasSettings } from 'arlas-wui-toolkit';

@Injectable()
export class LoadService {

  public appData: any;

  constructor(
      private arlasStartupService: ArlasStartupService,
      private https: HttpClient) {

    }

  public load(config: string): Promise<any> {
    return this.http
      .get(config)
      .toPromise()
      .then(response => this.appData = response)
      .then(() => this.arlasStartupService.applyAppSettings())
      .then((s: ArlasSettings) => this.arlasStartupService.authenticate(s))
      .then((s: ArlasSettings) => this.arlasStartupService.enrichHeaders(s))
      .catch(error => {
        console.log(error);
      });
  }
}

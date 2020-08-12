import { Injectable, Injector, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArlasStartupService, ArlasSettings } from 'arlas-wui-toolkit';

@Injectable()
export class LoadService {

  public appData: any;

  constructor(
      private arlasStartupService: ArlasStartupService,
      private https: HttpClient) {
    }

  public init(config: string): Promise<any> {
    return this.https
      .get(config)
      .toPromise()
      .then(response => this.appData = response)
      .then(() => this.arlasStartupService.applyAppSettings())
      .then((s: ArlasSettings) => this.arlasStartupService.authenticate(s))
      .then((s: ArlasSettings) => this.arlasStartupService.enrichHeaders(s))
      .then(() => this.arlasStartupService.translationLoaded({}))
      .catch(error => {
        console.log(error);
      });
  }
}


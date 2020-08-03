import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArlasCollaborativesearchService, ArlasConfigService, 
  ArlasExploreApi, ArlasStartupService, ArlasSettings } from 'arlas-wui-toolkit';
import { ArlasConfigurationUpdaterService } from 'arlas-wui-toolkit/services/configuration-updater/configurationUpdater.service';
import { FETCH_OPTIONS, CONFIG_UPDATER } from 'arlas-wui-toolkit/services/startup/startup.service';
import { PersistenceService } from 'arlas-wui-toolkit/services/persistence/persistence.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LoadService extends ArlasStartupService {

  public appData: any;

  constructor(
      configService: ArlasConfigService,
      arlasCss: ArlasCollaborativesearchService,
      configurationUpdaterService: ArlasConfigurationUpdaterService,
      injector: Injector,
    @Inject(FETCH_OPTIONS)   fetchOptions,
     http: HttpClient,
     private https: HttpClient,

     translateService: TranslateService,
    @Inject(CONFIG_UPDATER)  configUpdater,
     persistenceService: PersistenceService) { 
      super(configService, arlasCss, configurationUpdaterService, injector,
        fetchOptions, http, translateService, configUpdater, persistenceService)
    }

  public load(config: string): Promise<any> {
    return this.http
      .get(config)
      .toPromise()
      .then(response => this.appData = response)
      .then(()=> this.applyAppSettings())
      .then((s: ArlasSettings) => this.authenticate(s))
      .then((s: ArlasSettings) => this.enrichHeaders(s))
      .catch(error => {
        console.log(error);
      });
  }
}

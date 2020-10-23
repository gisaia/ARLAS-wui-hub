import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, forwardRef, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorIntl } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OAuthModule } from 'angular-oauth2-oidc';
import { ArlasToolkitSharedModule } from 'arlas-wui-toolkit';
import { auhtentServiceFactory, configUpdaterFactory, getOptionsFactory } from 'arlas-wui-toolkit/app.module';
import { ActionModalModule } from 'arlas-wui-toolkit/components/config-manager/action-modal/action-modal.module';
import { ConfigMenuModule } from 'arlas-wui-toolkit/components/config-manager/config-menu/config-menu.module';
import { ErrorModalModule } from 'arlas-wui-toolkit/components/errormodal/errormodal.module';
import { AuthentificationService } from 'arlas-wui-toolkit/services/authentification/authentification.service';
import { ArlasColorGeneratorLoader } from 'arlas-wui-toolkit/services/color-generator-loader/color-generator-loader.service';
import { ArlasConfigurationUpdaterService } from 'arlas-wui-toolkit/services/configuration-updater/configurationUpdater.service';
import { GET_OPTIONS } from 'arlas-wui-toolkit/services/persistence/persistence.service';
import {
  ArlasCollaborativesearchService,
  ArlasStartupService,
  CONFIG_UPDATER,
  FETCH_OPTIONS
} from 'arlas-wui-toolkit/services/startup/startup.service';
import { PaginatorI18n } from 'arlas-wui-toolkit/tools/paginatori18n';
import { AppRoutingModule } from './app-routing.modules';
import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { DynamicHubComponent } from './components/dynamic-hub/dynamic-hub.component';
import { HeaderComponent } from './components/header/header.component';
import { LeftMenuComponent } from './components/left-menu/left-menu.component';
import { StaticHubComponent } from './components/static-hub/static-hub.component';
import { LoadService } from './services/load.service';
import { SidenavService } from './services/sidenav.service';

export function loadServiceFactory(loadService: LoadService) {
  const load = () => loadService.init('config.json?' + Date.now());
  return load;

}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LeftMenuComponent,
    StaticHubComponent,
    DynamicHubComponent,
    HeaderComponent,
    CardComponent
  ],
  imports: [
    AppRoutingModule,
    ActionModalModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatTooltipModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatListModule,
    MatTooltipModule,
    HttpClientModule,
    ConfigMenuModule,
    ErrorModalModule,
    ArlasToolkitSharedModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    OAuthModule.forRoot()

  ],
  providers: [
    SidenavService,
    forwardRef(() => ArlasColorGeneratorLoader),
    forwardRef(() => LoadService),
    forwardRef(() => ArlasStartupService),
    forwardRef(() => ArlasCollaborativesearchService),
    {
      provide: APP_INITIALIZER,
      useFactory: loadServiceFactory,
      deps: [LoadService],
      multi: true
    },
    {
      provide: 'AuthentificationService',
      useFactory: auhtentServiceFactory,
      deps: [AuthentificationService],
      multi: true
    },
    {
      provide: ArlasConfigurationUpdaterService,
      useClass: ArlasConfigurationUpdaterService
    },
    { provide: FETCH_OPTIONS, useValue: {} },
    {
      provide: CONFIG_UPDATER,
      useValue: configUpdaterFactory
    },
    {
      provide: MatPaginatorIntl,
      deps: [TranslateService],
      useFactory: (translateService: TranslateService) => new PaginatorI18n(translateService).getPaginatorIntl()
    },
    {
      provide: GET_OPTIONS,
      useFactory: getOptionsFactory,
      deps: [AuthentificationService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

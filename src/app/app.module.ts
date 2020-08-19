import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, forwardRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { LoadService } from './services/load.service';
import { HttpClientModule } from '@angular/common/http';
import { LeftMenuComponent } from './components/left-menu/left-menu.component';
import { StaticHubComponent } from './components/static-hub/static-hub.component';
import { AppRoutingModule } from './app-routing.modules';
import { SidenavService } from './services/sidenav.service';
import { DynamicHubComponent } from './components/dynamic-hub/dynamic-hub.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from './components/header/header.component';
import { CardComponent } from './components/card/card.component';
import { MatMenuModule } from '@angular/material/menu';
import { GET_OPTIONS } from 'arlas-wui-toolkit/services/persistence/persistence.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AuthentificationService } from 'arlas-wui-toolkit/services/authentification/authentification.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { ArlasCollaborativesearchService, ArlasStartupService } from 'arlas-wui-toolkit/services/startup/startup.service';
import { ConfigMenuModule } from 'arlas-wui-toolkit/components/config-manager/config-menu/config-menu.module';
import { ArlasConfigurationUpdaterService } from 'arlas-wui-toolkit/services/configuration-updater/configurationUpdater.service';
import { FETCH_OPTIONS, CONFIG_UPDATER } from 'arlas-wui-toolkit/services/startup/startup.service';
import { configUpdaterFactory, getOptionsFactory, auhtentServiceFactory, paginatori18nFactory } from 'arlas-wui-toolkit/app.module';
import { ErrorModalModule } from 'arlas-wui-toolkit/components/errormodal/errormodal.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { ActionModalModule } from 'arlas-wui-toolkit/components/config-manager/action-modal/action-modal.module';
import { ActionModalComponent } from 'arlas-wui-toolkit/components/config-manager/action-modal/action-modal.component';
import { MatPaginatorIntl } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { ArlasColorGeneratorLoader } from 'arlas-wui-toolkit/services/color-generator-loader/color-generator-loader.service';
import { PaginatorI18n } from 'arlas-wui-toolkit/tools/paginatori18n';
import { UserInfosComponent } from 'arlas-wui-toolkit//components/user-infos/user-infos.component';
import { ArlasToolkitSharedModule } from 'arlas-wui-toolkit';


export function loadServiceFactory(loadService: LoadService) {
  const load = () => loadService.init('config.json?' + Date.now());
  return load;

}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
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
  entryComponents: [
    ActionModalComponent,
    UserInfosComponent
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

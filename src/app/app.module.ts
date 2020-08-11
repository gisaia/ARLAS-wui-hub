import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, forwardRef } from '@angular/core';
import { MatButtonModule, MatCardModule, MatTooltipModule } from '@angular/material';

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
import { MatPaginatorModule } from '@angular/material/paginator';
import { GET_OPTIONS } from 'arlas-wui-toolkit/services/persistence/persistence.service';
import { AuthentificationService } from 'arlas-wui-toolkit/services/authentification/authentification.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { ArlasCollaborativesearchService } from 'arlas-wui-toolkit/services/startup/startup.service';
import { ConfigMenuModule } from 'arlas-wui-toolkit/components/config-manager/config-menu/config-menu.module';
import { ArlasConfigurationUpdaterService } from 'arlas-wui-toolkit/services/configuration-updater/configurationUpdater.service';
import { FETCH_OPTIONS, CONFIG_UPDATER } from 'arlas-wui-toolkit/services/startup/startup.service';
import { configUpdaterFactory, getOptionsFactory, auhtentServiceFactory } from 'arlas-wui-toolkit/app.module';
import { ArlasStartupService } from 'arlas-wui-toolkit';
import { ErrorModalModule } from 'arlas-wui-toolkit/components/errormodal/errormodal.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';

export function loadServiceFactory(loadService: LoadService) {
  const load = () => loadService.load('config.json?' + Date.now());
  return load;
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
    BrowserModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatListModule,
    MatTooltipModule,
    HttpClientModule,
    ConfigMenuModule,
    ErrorModalModule,
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
    forwardRef(() => LoadService),
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
      provide: GET_OPTIONS,
      useFactory: getOptionsFactory,
      deps: [AuthentificationService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

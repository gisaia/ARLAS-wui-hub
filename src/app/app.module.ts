/*
Licensed to Gisaïa under one or more contributor
license agreements. See the NOTICE.txt file distributed with
this work for additional information regarding copyright
ownership. Gisaïa licenses this file to you under
the Apache License, Version 2.0 (the "License"); you may
not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, forwardRef, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OAuthModule } from 'angular-oauth2-oidc';
import {
    ArlasColorGeneratorLoader, ArlasConfigurationUpdaterService,
    ArlasToolkitSharedModule, auhtentServiceFactory, AuthentificationService,
    ConfigMenuModule, configUpdaterFactory,
    ErrorModalModule, getOptionsFactory, GET_OPTIONS
} from 'arlas-wui-toolkit';
import {
    ArlasCollaborativesearchService,
    ArlasStartupService,
    CONFIG_UPDATER,
    FETCH_OPTIONS
} from 'arlas-wui-toolkit';
import { PaginatorI18n } from 'arlas-wui-toolkit';
import { AppRoutingModule } from './app-routing.modules';
import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { DynamicHubComponent } from './components/dynamic-hub/dynamic-hub.component';
import { HeaderComponent } from './components/header/header.component';
import { LeftMenuComponent } from './components/left-menu/left-menu.component';
import { StaticHubComponent } from './components/static-hub/static-hub.component';
import { LoadService } from './services/load.service';
import { SidenavService } from './services/sidenav.service';
import { ActionModalModule } from 'arlas-wui-toolkit';
import { CommonModule } from '@angular/common';

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
        CommonModule,
        MatFormFieldModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
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

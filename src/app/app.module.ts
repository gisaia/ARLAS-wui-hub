/*
 * Licensed to Gisaïa under one or more contributor
 * license agreements. See the NOTICE.txt file distributed with
 * this work for additional information regarding copyright
 * ownership. Gisaïa licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, forwardRef, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyPaginatorIntl as MatPaginatorIntl, MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { GetValueModule, GetCollectionDisplayModule } from 'arlas-web-components';
import enComponents from 'arlas-web-components/assets/i18n/en.json';
import frComponents from 'arlas-web-components/assets/i18n/fr.json';
import {
    ActionModalModule,
    ArlasCollaborativesearchService,
    ArlasConfigurationUpdaterService,
    ArlasIamService,
    ArlasSettingsService,
    ArlasStartupService,
    ArlasToolkitSharedModule, auhtentServiceFactory, AuthentificationService,
    CONFIG_UPDATER,
    ConfigMenuModule, configUpdaterFactory,
    FETCH_OPTIONS,
    GET_OPTIONS,
    getOptionsFactory,
    iamServiceFactory,
    PaginatorI18n
} from 'arlas-wui-toolkit';
import enToolkit from 'arlas-wui-toolkit/assets/i18n/en.json';
import frToolkit from 'arlas-wui-toolkit/assets/i18n/fr.json';
import { Observable } from 'rxjs';
import { AppRoutingModule } from './app-routing.modules';
import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { DynamicHubComponent } from './components/dynamic-hub/dynamic-hub.component';
import { HeaderComponent } from './components/header/header.component';
import { HubActionModalComponent } from './components/hub-action-modal/hub-action-modal.component';
import { LeftMenuComponent } from './components/left-menu/left-menu.component';
import { StaticHubComponent } from './components/static-hub/static-hub.component';
import { PreviewPipe } from './pipes/preview.pipe';
import { LoadService } from './services/load.service';
import { SidenavService } from './services/sidenav.service';
import { CardDropdownComponent } from './components/dynamic-hub/collapse/card-dropdown.component';
import { DashboardSearchComponent } from './components/dashboard-search/dashboard-search.component';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export function loadServiceFactory(loadService: LoadService) {
    const load = () => loadService.init('config.json?' + Date.now());
    return load;

}
export class CustomTranslateLoader implements TranslateLoader {

    public constructor(private http: HttpClient) { }

    public getTranslation(lang: string): Observable<any> {
        const apiAddress = 'assets/i18n/' + lang + '.json?' + Date.now();
        return Observable.create(observer => {
            this.http.get(apiAddress).subscribe(
                res => {
                    let merged = res;
                    // Properties in res will overwrite those in fr.
                    if (lang === 'fr') {
                        merged = { ...frComponents, ...frToolkit, ...res };
                    } else if (lang === 'en') {
                        merged = { ...enComponents, ...enToolkit, ...res };
                    }
                    observer.next(merged);
                    observer.complete();
                },
                error => {
                    // failed to retrieve requested language file, use default
                    observer.complete(); // => Default language is already loaded
                }
            );
        });
    }
}

@NgModule({
    declarations: [
        AppComponent,
        CardComponent,
        DynamicHubComponent,
        HeaderComponent,
        HubActionModalComponent,
        LeftMenuComponent,
        StaticHubComponent,
        PreviewPipe,
        CardDropdownComponent,
        DashboardSearchComponent
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
        MatSelectModule,
        MatSidenavModule,
        MatPaginatorModule,
        MatListModule,
        MatTooltipModule,
        MatProgressBarModule,
        HttpClientModule,
        ConfigMenuModule,
        ArlasToolkitSharedModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: CustomTranslateLoader,
                deps: [HttpClient]
            }
        }),
        OAuthModule.forRoot(),
        GetValueModule,
        GetCollectionDisplayModule
    ],
    providers: [
        SidenavService,
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
            provide: 'ArlasIamService',
            useFactory: iamServiceFactory,
            deps: [ArlasIamService],
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
            useFactory: (translateService: TranslateService) => new PaginatorI18n(translateService)
        },
        {
            provide: GET_OPTIONS,
            useFactory: getOptionsFactory,
            deps: [ArlasSettingsService, AuthentificationService, ArlasIamService]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

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
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { forwardRef, importProvidersFrom, inject, provideAppInitializer } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { routes } from 'app/app-routing.modules';
import {
    ArlasIamService, ArlasSettingsService, ArlasStartupService,
    ArlasToolkitSharedModule,
    auhtentServiceFactory, AuthentificationService,
    CONFIG_UPDATER, configUpdaterFactory, FETCH_OPTIONS, GET_OPTIONS, getOptionsFactory, iamServiceFactory, PaginatorI18n
} from 'arlas-wui-toolkit';
import { AppComponent } from './app/app.component';
import { CustomTranslateLoader } from './app/app.module';
import { LoadService } from './app/services/load.service';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            OAuthModule.forRoot(),
            ArlasToolkitSharedModule
        ),
        provideTranslateService({
            loader: {
                provide: TranslateLoader,
                useClass: CustomTranslateLoader,
                deps: [HttpClient]
            }
        }),
        provideHttpClient(withInterceptorsFromDi()),
        provideAppInitializer(() => inject(LoadService).init()),
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
        },
        provideAnimations(),
        forwardRef(() => LoadService),
        forwardRef(() => ArlasStartupService),
        provideRouter(routes)
    ]
})
    .catch(err => console.log(err));

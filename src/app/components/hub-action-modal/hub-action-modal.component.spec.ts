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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';
import { HubActionModalComponent } from './hub-action-modal.component';
import { ShareConfigModule } from 'arlas-wui-toolkit/lib/components/config-manager/share-config/share-config.module';
import { AuthentificationService, GET_OPTIONS, getOptionsFactory } from 'arlas-wui-toolkit';


describe('HubActionModalComponent', () => {
    let component: HubActionModalComponent;
    let fixture: ComponentFixture<HubActionModalComponent>;

    beforeEach(async(() => {
        const mockDialogRef = {
            close: jasmine.createSpy('close')
        };
        TestBed.configureTestingModule({
            declarations: [HubActionModalComponent],
            imports: [
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
                MatMenuModule,
                MatIconModule,
                MatDialogModule,
                MatFormFieldModule,
                MatInputModule,
                MatButtonModule,
                FormsModule,
                HttpClientModule,
                ShareConfigModule
            ],
            providers: [
                AuthentificationService,
                OAuthService,
                OAuthLogger,
                DateTimeProvider,
                UrlHelperService,
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {}
                },
                {
                    provide: MatDialogRef,
                    useValue: mockDialogRef
                },
                {
                    provide: GET_OPTIONS,
                    useFactory: getOptionsFactory,
                    deps: [AuthentificationService]
                }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HubActionModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

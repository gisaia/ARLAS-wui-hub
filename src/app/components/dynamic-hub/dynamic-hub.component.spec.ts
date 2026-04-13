import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { mockArlasSettingsService, mockErrorService, mockPermissionService, mockPersistenceService } from 'app/test/mock';
import { AwcColorGeneratorLoader, ColorGeneratorLoader, ColorGeneratorModule } from 'arlas-web-components';
import {
    ArlasCollaborativesearchService, ArlasSettingsService,
    ErrorService, PermissionService, PersistenceService
} from 'arlas-wui-toolkit';
import { beforeEach, describe, expect, it } from 'vitest';
import { DynamicHubComponent } from './dynamic-hub.component';

describe('DynamicHubComponent', () => {
    let component: DynamicHubComponent;
    let fixture: ComponentFixture<DynamicHubComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
                DynamicHubComponent,
                ColorGeneratorModule.forRoot({
                    loader: {
                        provide: ColorGeneratorLoader,
                        useClass: AwcColorGeneratorLoader
                    }
                }),
                OAuthModule.forRoot()
            ],
            providers: [
                ArlasCollaborativesearchService,
                {
                    provide: PersistenceService,
                    useValue: mockPersistenceService
                },
                {
                    provide: PermissionService,
                    useValue: mockPermissionService
                },
                {
                    provide: ErrorService,
                    useValue: mockErrorService
                },
                {
                    provide: ArlasSettingsService,
                    useValue: mockArlasSettingsService
                }
            ],
            teardown: { destroyAfterEach: false }
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicHubComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

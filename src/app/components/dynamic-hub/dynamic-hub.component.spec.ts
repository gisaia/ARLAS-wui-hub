import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import {
    ArlasToolkitSharedModule, ArlasToolKitModule, ArlasCollaborativesearchService,
    ErrorModalModule, PermissionService, ArlasSettingsService, PersistenceService
} from 'arlas-wui-toolkit';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { DynamicHubComponent } from './dynamic-hub.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MockArlasSettingsService, MockPermissionService } from '../../tools/tools';

describe('DynamicHubComponent', () => {
    let component: DynamicHubComponent;
    let fixture: ComponentFixture<DynamicHubComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DynamicHubComponent],
            imports: [ArlasToolkitSharedModule, ArlasToolKitModule, ErrorModalModule,
                MatCardModule, MatChipsModule, MatIconModule, MatCheckboxModule,
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
            ],
            providers: [ArlasCollaborativesearchService, PersistenceService,
                {
                    provide: PermissionService,
                    useClass: MockPermissionService
                },
                {
                    provide: ArlasSettingsService,
                    useClass: MockArlasSettingsService
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicHubComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

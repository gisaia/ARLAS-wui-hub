import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatIconModule } from '@angular/material/icon';
import {
    ArlasToolkitSharedModule, ArlasToolKitModule,
    ArlasCollaborativesearchService,
    PermissionService, ArlasSettingsService, PersistenceService, ErrorService
} from 'arlas-wui-toolkit';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { DynamicHubComponent } from './dynamic-hub.component';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MockArlasSettingsService, MockErrorService, MockPermissionService } from '../../tools/tools';

describe('DynamicHubComponent', () => {
    let component: DynamicHubComponent;
    let fixture: ComponentFixture<DynamicHubComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DynamicHubComponent],
            imports: [ArlasToolkitSharedModule, ArlasToolKitModule,
                MatCardModule, MatChipsModule, MatIconModule, MatCheckboxModule,
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
            ],
            providers: [ ArlasCollaborativesearchService, PersistenceService,
                {
                    provide: PermissionService,
                    useClass: MockPermissionService
                },
                {
                    provide: ErrorService,
                    useClass: MockErrorService
                },
                {
                    provide: ArlasSettingsService,
                    useClass: MockArlasSettingsService
                }
            ],
            teardown: { destroyAfterEach: false }
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

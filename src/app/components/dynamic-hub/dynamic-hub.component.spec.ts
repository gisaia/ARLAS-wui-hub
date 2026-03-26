import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import {
    ArlasCollaborativesearchService,
    ArlasSettingsService,
    ArlasToolKitModule,
    ArlasToolkitSharedModule,
    ErrorService,
    PermissionService,
    PersistenceService
} from 'arlas-wui-toolkit';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MockArlasSettingsService, MockErrorService, MockPermissionService } from '../../tools/tools';
import { DynamicHubComponent } from './dynamic-hub.component';

describe('DynamicHubComponent', () => {
    let component: DynamicHubComponent;
    let fixture: ComponentFixture<DynamicHubComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [ArlasToolkitSharedModule, ArlasToolKitModule,
        MatCardModule, MatChipsModule, MatIconModule, MatCheckboxModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }), DynamicHubComponent],
    providers: [ArlasCollaborativesearchService, PersistenceService,
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

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { ArlasColorService } from 'arlas-web-components';
import {
    ArlasCollaborativesearchService,
    ArlasToolKitModule, ArlasToolkitSharedModule, ConfigMenuModule, PermissionService, PersistenceService
} from 'arlas-wui-toolkit';
import { MockPermissionService } from '../../tools/tools';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
    let component: CardComponent;
    let fixture: ComponentFixture<CardComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [ArlasToolkitSharedModule, ArlasToolKitModule, ConfigMenuModule, MatCardModule, MatChipsModule, MatIconModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }), CardComponent],
    providers: [ArlasColorService, ArlasCollaborativesearchService, PersistenceService,
        {
            provide: PermissionService,
            useClass: MockPermissionService
        }
    ],
    teardown: { destroyAfterEach: false }
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

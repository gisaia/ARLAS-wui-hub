import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardComponent } from './card.component';
import {
    ArlasCollaborativesearchService,
    ArlasToolKitModule, ArlasToolkitSharedModule, ConfigMenuModule, PermissionService, PersistenceService
} from 'arlas-wui-toolkit';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MockPermissionService } from '../../tools/tools';
import { ArlasColorService } from 'arlas-web-components';

describe('CardComponent', () => {
    let component: CardComponent;
    let fixture: ComponentFixture<CardComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CardComponent],
            imports: [ArlasToolkitSharedModule, ArlasToolKitModule, ConfigMenuModule, MatCardModule, MatChipsModule, MatIconModule,
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })

            ],
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

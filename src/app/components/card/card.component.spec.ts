import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';
import {
    ArlasCollaborativesearchService,
    ArlasToolKitModule, ArlasToolkitSharedModule, ConfigMenuModule, PermissionService, PersistenceService
} from 'arlas-wui-toolkit';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatIconModule } from '@angular/material/icon';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MockPermissionService } from '../../tools/tools';
import { ArlasColorService } from 'arlas-web-components';

describe('CardComponent', () => {
    let component: CardComponent;
    let fixture: ComponentFixture<CardComponent>;

    beforeEach(async(() => {
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

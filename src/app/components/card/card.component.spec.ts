import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
describe('CardComponent', () => {
    let component: CardComponent;
    let fixture: ComponentFixture<CardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CardComponent],
            imports: [ArlasToolkitSharedModule, ArlasToolKitModule, ConfigMenuModule, MatCardModule, MatChipsModule, MatIconModule,
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })

            ],
            providers: [ArlasCollaborativesearchService, PersistenceService,
                {
                    provide: PermissionService,
                    useClass: MockPermissionService
                }]
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

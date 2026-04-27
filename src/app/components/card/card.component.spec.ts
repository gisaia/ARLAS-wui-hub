import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import {
    ArlasCollaborativesearchService,
    ArlasCollectionService,
    ArlasStartupService,
    PermissionService, PersistenceService
} from 'arlas-wui-toolkit';
import { beforeEach, describe, expect, it } from 'vitest';
import { mockArlasStartupService, mockPermissionService, mockPersistenceService } from '../../test/mock';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
    let component: CardComponent;
    let fixture: ComponentFixture<CardComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                CardComponent,
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
                OAuthModule.forRoot()
            ],
            providers: [
                ArlasCollaborativesearchService,
                {
                    provide: PermissionService,
                    useValue: mockPermissionService
                },
                {
                    provide: PersistenceService,
                    useValue: mockPersistenceService
                },
                ArlasCollectionService,
                {
                    provide: ArlasStartupService,
                    useValue: mockArlasStartupService
                }
            ],
            teardown: { destroyAfterEach: false }
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

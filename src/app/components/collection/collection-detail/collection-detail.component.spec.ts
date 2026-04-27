import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { mockArlasStartupService, mockCollectionService } from 'app/test/mock';
import { ArlasStartupService } from 'arlas-wui-toolkit';
import { beforeEach, describe, expect, it } from 'vitest';
import { CollectionService } from '../../../services/collection.service';
import { CollectionDetailComponent } from './collection-detail.component';

describe('CollectionDetailComponent', () => {
    let component: CollectionDetailComponent;
    let fixture: ComponentFixture<CollectionDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CollectionDetailComponent,
                RouterModule.forRoot([]),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader }
                }),
                OAuthModule.forRoot()
            ],
            providers: [
                {
                    provide: CollectionService,
                    useValue: mockCollectionService
                },
                {
                    provide: ArlasStartupService,
                    useValue: mockArlasStartupService
                },
                provideHttpClient(withInterceptors([])),
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CollectionDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

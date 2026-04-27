import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { mockArlasStartupService, mockCollectionService } from 'app/test/mock';
import { ArlasStartupService } from 'arlas-wui-toolkit';
import { beforeEach, describe, expect, it } from 'vitest';
import { CollectionService } from '../../services/collection.service';
import { CollectionComponent } from './collection.component';

describe('CollectionComponent', () => {
    let component: CollectionComponent;
    let fixture: ComponentFixture<CollectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CollectionComponent,
                OAuthModule.forRoot(),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader }
                }),
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

        fixture = TestBed.createComponent(CollectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

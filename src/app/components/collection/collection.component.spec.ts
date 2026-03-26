import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { ArlasStartupService } from 'arlas-wui-toolkit';
import { of } from 'rxjs';
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
                    useValue: {
                        getCollectionsReferenceDescription: () => of([])
                    }
                },
                {
                    provide: ArlasStartupService,
                    useValue: {
                        shouldRunApp: true
                    }
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

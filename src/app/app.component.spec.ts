import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { OAuthModule } from 'angular-oauth2-oidc';
import { ArlasSettingsService } from 'arlas-wui-toolkit';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppComponent } from './app.component';
import { LoadService } from './services/load.service';
import { SidenavService } from './services/sidenav.service';
import { mockArlasSettingsService } from './test/mock';

describe('AppComponent', () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                AppComponent,
                OAuthModule.forRoot(),
                RouterModule.forRoot([])
            ],
            providers: [
                LoadService,
                SidenavService,
                {
                    provide: ArlasSettingsService,
                    useValue: mockArlasSettingsService
                }
            ],
            teardown: { destroyAfterEach: false }
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });
});

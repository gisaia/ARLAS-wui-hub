import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { LeftMenuComponent } from './left-menu.component';

describe('LeftMenuComponent', () => {
    let component: LeftMenuComponent;
    let fixture: ComponentFixture<LeftMenuComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
                LeftMenuComponent,
                RouterModule.forRoot([])
            ],
            teardown: { destroyAfterEach: false }
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LeftMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

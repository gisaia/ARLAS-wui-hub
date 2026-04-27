import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { DashboardSearchComponent } from './dashboard-search.component';

describe('DashboardSearchComponent', () => {
    let component: DashboardSearchComponent;
    let fixture: ComponentFixture<DashboardSearchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                DashboardSearchComponent,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader }
                })
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DashboardSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

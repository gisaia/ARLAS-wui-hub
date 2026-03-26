import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { ArlasToolKitModule, ArlasToolkitSharedModule } from 'arlas-wui-toolkit';
import { SidenavService } from '../../services/sidenav.service';
import { LeftMenuComponent } from './left-menu.component';

describe('LeftMenuComponent', () => {
    let component: LeftMenuComponent;
    let fixture: ComponentFixture<LeftMenuComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [ArlasToolkitSharedModule, ArlasToolKitModule, MatListModule, MatDividerModule, MatIconModule,
        MatSidenavModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }), LeftMenuComponent],
    providers: [SidenavService],
    teardown: { destroyAfterEach: false }
})
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LeftMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

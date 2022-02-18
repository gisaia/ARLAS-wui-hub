import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LoadService } from './services/load.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ArlasToolKitModule, ArlasToolkitSharedModule } from 'arlas-wui-toolkit';
import { SidenavService } from './services/sidenav.service';
describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            imports: [MatSidenavModule, ArlasToolKitModule, ArlasToolkitSharedModule],
            providers: [LoadService, SidenavService]
        }).compileComponents();
    }));
    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });
});

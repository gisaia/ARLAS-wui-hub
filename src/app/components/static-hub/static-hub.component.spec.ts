import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { StaticHubComponent } from './static-hub.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { LoadService } from '../../services/load.service';
import { ArlasStartupService, ArlasToolKitModule, ArlasToolkitSharedModule } from 'arlas-wui-toolkit';

describe('StaticHubComponent', () => {
  let component: StaticHubComponent;
  let fixture: ComponentFixture<StaticHubComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StaticHubComponent
      ],
      imports: [ MatCardModule, ArlasToolKitModule, ArlasToolkitSharedModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      providers: [LoadService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


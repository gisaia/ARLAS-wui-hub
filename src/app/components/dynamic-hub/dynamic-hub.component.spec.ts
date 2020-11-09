import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicHubComponent } from './dynamic-hub.component';

describe('DynamicHubComponent', () => {
  let component: DynamicHubComponent;
  let fixture: ComponentFixture<DynamicHubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicHubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

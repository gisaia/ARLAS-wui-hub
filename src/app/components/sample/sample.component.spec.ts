import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { ArlasCollaborativesearchService } from 'arlas-wui-toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SampleComponent } from './sample.component';

describe('SampleComponent', () => {
  let component: SampleComponent;
  let fixture: ComponentFixture<SampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SampleComponent,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
      ],
      providers: [
        {
          provide: ArlasCollaborativesearchService,
          useValue: {
            getExploreApi: vi.fn(() => ({
              search: vi.fn(() => Promise.resolve())
            }))
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('collection', {
      collection_name: 'Test',
      params: {
        index_name: 'test',
        id_path: 'id',
        geometry_path: 'geometry',
        centroid_path: 'centroid',
        timestamp_path: 'timestamp'
      }
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

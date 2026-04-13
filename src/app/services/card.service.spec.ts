import { TestBed } from '@angular/core/testing';
import { mockArlasSettingsService, mockPermissionService, mockPersistenceService } from 'app/test/mock';
import { AwcColorGeneratorLoader, ColorGeneratorLoader, ColorGeneratorModule } from 'arlas-web-components';
import { ArlasSettingsService, PermissionService, PersistenceService } from 'arlas-wui-toolkit';
import { beforeEach, describe, expect, it } from 'vitest';
import { CardService } from './card.service';

describe('CardService', () => {
    let service: CardService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ColorGeneratorModule.forRoot({
                    loader: {
                        provide: ColorGeneratorLoader,
                        useClass: AwcColorGeneratorLoader
                    }
                }),
            ],
            providers: [
                {
                    provide: PermissionService,
                    useValue: mockPermissionService
                },
                {
                    provide: ArlasSettingsService,
                    useValue: mockArlasSettingsService
                },
                {
                    provide: PersistenceService,
                    useValue: mockPersistenceService
                }
            ],
            teardown: { destroyAfterEach: false }
        });

        service = TestBed.inject(CardService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

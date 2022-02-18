import { inject, TestBed } from '@angular/core/testing';
import {
    ArlasColorGeneratorLoader, PermissionService, ArlasSettingsService,
    ArlasToolKitModule, ArlasToolkitSharedModule
} from 'arlas-wui-toolkit';
import { MockPermissionService, MockArlasSettingsService } from '../tools/tools';

import { CardService } from './card.service';

describe('CardService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ArlasToolkitSharedModule, ArlasToolKitModule],
            providers: [ArlasColorGeneratorLoader,
                {
                    provide: PermissionService,
                    useClass: MockPermissionService
                },
                {
                    provide: ArlasSettingsService,
                    useClass: MockArlasSettingsService
                }]
        });
    });



    it('should be created', inject([],
        () => {
            const service: CardService = TestBed.get(CardService);
            expect(service).toBeTruthy();
        }));
});

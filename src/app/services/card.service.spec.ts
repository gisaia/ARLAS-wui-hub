import { inject, TestBed } from '@angular/core/testing';
import { PermissionService, ArlasSettingsService, ArlasToolKitModule, ArlasToolkitSharedModule
} from 'arlas-wui-toolkit';
import { MockPermissionService, MockArlasSettingsService } from '../tools/tools';
import { CardService } from './card.service';
import { ArlasColorService } from 'arlas-web-components';

describe('CardService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ArlasToolkitSharedModule, ArlasToolKitModule],
            providers: [ArlasColorService,
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

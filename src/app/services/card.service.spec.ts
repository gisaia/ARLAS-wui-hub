import { TestBed } from '@angular/core/testing';
import { ArlasColorService } from 'arlas-web-components';
import {
    ArlasSettingsService, ArlasToolKitModule, ArlasToolkitSharedModule, PermissionService
} from 'arlas-wui-toolkit';
import { MockArlasSettingsService, MockPermissionService } from '../tools/tools';
import { CardService } from './card.service';

describe('CardService', () => {
    let service: CardService;

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
                }],
            teardown: { destroyAfterEach: false }
        });

        service = TestBed.inject(CardService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

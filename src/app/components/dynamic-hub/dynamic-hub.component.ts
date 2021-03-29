import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Action } from '../card/card.component';
import { Card } from '../../services/card.service';
import { CardService } from '../../services/card.service';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { AuthentificationService } from 'arlas-wui-toolkit/services/authentification/authentification.service';
import { PermissionService } from 'arlas-wui-toolkit/services/permission/permission.service';
import { ActionModalComponent } from 'arlas-wui-toolkit/components/config-manager/action-modal/action-modal.component';
import { ArlasSettingsService } from 'arlas-wui-toolkit/services/settings/arlas.settings.service';
import { ConfigAction, ConfigActionEnum } from 'arlas-wui-toolkit';
import { Resource } from 'arlas-permissions-api';


@Component({
    selector: 'app-dynamic-hub',
    templateUrl: './dynamic-hub.component.html',
    styleUrls: ['./dynamic-hub.component.scss']
})
export class DynamicHubComponent implements OnInit {

    @ViewChildren('checkBox') checkBox: QueryList<any>;

    public action = Action;
    public pageSize = 20;
    public pageNumber = 0;
    public isLoading = false;
    public resultsLength = 0;
    public cards: Card[];
    public cardsRef: Card[];
    public cardCollections: Map<string, string> = new Map<string, string>();
    public canCreateDashboard = false;

    public userGroups: string[] = [];

    constructor(
        private cardService: CardService,
        private dialog: MatDialog,
        private authentService: AuthentificationService,
        private arlasSettingsService: ArlasSettingsService,
        private permissionService: PermissionService) { }

    public ngOnInit(): void {
        this.permissionService.get('persist/resource/config.json').subscribe((resources: Resource[]) => {
            this.canCreateDashboard = (resources.filter(r => r.verb === 'POST').length > 0);
        });
        if (
            !this.arlasSettingsService.getSettings().authentication ||
            (!!this.arlasSettingsService.getSettings().authentication
                && this.arlasSettingsService.getSettings().authentication.force_connect === false)
        ) {
            this.fetchCards();
        }
        this.authentService.canActivateProtectedRoutes.subscribe(data => {
            this.fetchCards();
        });

        if (!!this.authentService.identityClaims) {
            this.authentService.loadUserInfo().subscribe(data => {
                this.userGroups = data['http://arlas.io/roles'].filter(r => r.startsWith('group/'))
                    .map(r => r.split('/')[r.split('/').length - 1]);
            });
        }
    }

    public add() {
        const action: ConfigAction = {
            type: ConfigActionEnum.CREATE,
            config: null
        };
        const dialogRef = this.dialog.open(ActionModalComponent, {
            disableClose: true,
            data: {
                name: action.name,
                type: action.type
            }
        });
        dialogRef.afterClosed()
            .pipe(filter(result => result !== false))
            .subscribe(id => {
                this.fetchCards();
                const url = this.arlasSettingsService.getArlasBuilderUrl().concat('/load/').concat(id);
                const win = window.open(url, '_blank');
                win.focus();
            });
    }

    public import() {
        const url = this.arlasSettingsService.getArlasBuilderUrl().concat('/load/import');
        const win = window.open(url, '_blank');
        win.focus();
    }

    public fetchCards() {
        this.isLoading = true;
        this.cardService.cardList(
            this.pageSize,
            this.pageNumber + 1
        ).subscribe(
            (result: [number, Card[]]) => {
                this.cardCollections.clear();
                this.resultsLength = result[0];
                this.cards = Array.from(result[1]);
                this.cards.forEach(c => {
                    c.actions.filter(a => a.type === ConfigActionEnum.VIEW)
                        .map(a => a.url = this.arlasSettingsService.getArlasWuiUrl());
                    c.actions.filter(a => a.type === ConfigActionEnum.EDIT)
                        .map(a => a.url = this.arlasSettingsService.getArlasBuilderUrl().concat('/load/'));
                    if (!this.cardCollections.has(c.collection)) {
                        this.cardCollections.set(c.collection, c.color);
                    }
                });
                this.cardsRef = this.cards;
            },
            error => {
                console.error(error);
            },
            () => {
                this.isLoading = false;
            }
        );
    }

    public pageChange(pageEvent: PageEvent) {
        this.pageNumber = pageEvent.pageIndex;
        this.pageSize = pageEvent.pageSize;
        this.fetchCards();
    }

    public getCheckbox() {
        this.cards = this.cardsRef;
        const selectedCollection = this.checkBox.filter(checkbox => checkbox.checked);
        this.cards = this.cards.filter(c => selectedCollection.map(collec => collec.value).includes(c.collection));
    }

}

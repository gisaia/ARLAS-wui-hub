/*
 * Licensed to Gisaïa under one or more contributor
 * license agreements. See the NOTICE.txt file distributed with
 * this work for additional information regarding copyright
 * ownership. Gisaïa licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { UserOrgData } from 'arlas-iam-api';
import { PersistenceService } from 'arlas-wui-toolkit';

export enum HubActionEnum {
  CREATE,
  IMPORT
}

export interface HubAction {
  type: HubActionEnum;
  orgs: UserOrgData[];
  options?: any;
}

@Component({
    selector: 'arlas-hub-action-modal',
    templateUrl: './hub-action-modal.component.html',
    styleUrls: ['./hub-action-modal.component.scss'],
    standalone: false
})
export class HubActionModalComponent {

    public action: HubAction;
    public value: string;
    public HubAction = HubActionEnum;
    public currentOrga: any;
    public errorMessage = '';

    public constructor(
        @Inject(MAT_DIALOG_DATA) data: HubAction,
        private dialogRef: MatDialogRef<HubActionModalComponent>,
        private persistenceService: PersistenceService
    ) {
        this.action = data;
    }

    public create(name: string, orga: string) {
        this.action.options['headers']['arlas-org-filter'] = orga;
        this.persistenceService.create('config.json', name, '{}', [], [], this.action.options)
            .subscribe({
                next: (data) => {
                    this.errorMessage = '';
                    this.dialogRef.close([data.id,orga]);
                },
                error: (error) => this.raiseError(error)
            });
    }

    public import(){
        this.dialogRef.close(this.currentOrga);
    }


    public raiseError(err: any) {
        switch (err.status) {
            case 401:
                this.errorMessage = marker('Unauthorized to create a dashboard, you need to log in');
                break;
            case 403:
                this.errorMessage = marker('Missing permissions to create a dashboard');
                break;
            case 500:
                err.json().then(e => {
                    if ((e.message as string).indexOf('already exists') > 0) {
                        this.errorMessage = marker('A configuration with this name exists already, please choose another name');
                    } else {
                        this.errorMessage = marker('An error occurred, please try later');
                    }
                });
                break;
            default:
                this.errorMessage = marker('An error occurred, please try later');
        }
    }
}

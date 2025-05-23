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
import { Injectable } from '@angular/core';
import { ArlasConfigService, ArlasSettings, ArlasStartupService } from 'arlas-wui-toolkit';

@Injectable()
export class LoadService {

    public constructor(
        private readonly configService: ArlasConfigService,
        private readonly arlasStartupService: ArlasStartupService
    ) {
    }

    public init(): Promise<any> {
        return this.arlasStartupService.applyAppSettings()
            .then((s: ArlasSettings) => this.arlasStartupService.authenticate(s))
            .then((s: ArlasSettings) => this.arlasStartupService.enrichHeaders(s))
            .then((s: ArlasSettings) => new Promise((resolve, reject) => {
                this.configService.setConfig({});
                resolve('Successfullly initialized app');
            }))
            .then(() => this.arlasStartupService.translationLoaded({}))
            .catch(error => {
                console.log(error);
            });
    }
}


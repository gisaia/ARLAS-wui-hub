/*
Licensed to Gisaïa under one or more contributor
license agreements. See the NOTICE.txt file distributed with
this work for additional information regarding copyright
ownership. Gisaïa licenses this file to you under
the Apache License, Version 2.0 (the "License"); you may
not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/
import { Injectable, Injector, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArlasStartupService, ArlasSettings } from 'arlas-wui-toolkit';

@Injectable()
export class LoadService {

    public appData: any;

    public constructor(
        private arlasStartupService: ArlasStartupService,
        private https: HttpClient) {
    }

    public init(config: string): Promise<any> {
        return this.https
            .get(config)
            .toPromise()
            .then(response => this.appData = response)
            .then(() => this.arlasStartupService.applyAppSettings())
            .then((s: ArlasSettings) => this.arlasStartupService.authenticate(s))
            .then((s: ArlasSettings) => this.arlasStartupService.enrichHeaders(s))
            .then(() => this.arlasStartupService.translationLoaded({}))
            .catch(error => {
                console.log(error);
            });
    }
}


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
import { Component } from '@angular/core';
import { LoadService } from '../../services/load.service';

@Component({
  selector: 'arlas-static-hub',
  templateUrl: './static-hub.component.html',
  styleUrls: ['./static-hub.component.scss']
})
export class StaticHubComponent {

  public cards: any;
  public header: any;
  public footer: any;
  public items: any;

  public constructor(private loadService: LoadService) {
    this.header = this.loadService.appData?.header;
    this.footer = this.loadService.appData?.footer;
    this.cards = this.loadService.appData?.cards;
    this.items = this.footer?.items;
  }

  public navigate(url: string) {
    window.open(url, '_blank');
  }

}

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
import { Component, Input, Renderer2 } from '@angular/core';

@Component({
    selector: '[arlas-card-dropdown]',
    templateUrl: './card-dropdown.component.html',
    styles: ['.dynamic-collapse{height: 30px;width: 30px;line-height: 30px;}'],
})
export class CardDropdownComponent {
    @Input('arlas-card-dropdown') public collapsableElement: HTMLElement;
    public display = true;
    public constructor(private _r: Renderer2) { }

    public collapse() {
        this.display = !this.display;
        if(this.display){
            this._r.removeStyle(this.collapsableElement, 'display');
        } else {
            this._r.setStyle(this.collapsableElement, 'display', 'none');
        }
    }
}

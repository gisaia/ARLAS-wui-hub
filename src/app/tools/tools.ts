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
import { Observable, of } from 'rxjs';
import { ArlasSettings } from 'arlas-wui-toolkit';
import { CollectionReferenceDescription } from 'arlas-api';
import { FormControl, FormGroup } from '@angular/forms';

export class MockPermissionService {
    public get(): Observable<any> {
        return of({});
    }

    public createPermissionApiInstance() {
    }

    public setOptions() {

    }
}

export class MockErrorService {
    public emitUnavailableService(): Observable<any> {
        return of({});
    }
}

export class MockArlasSettingsService {
    public getSettings(): ArlasSettings {
        return {};
    }

    public getPersistenceSettings(): any {
        return {};
    }

    public getAuthentSettings(): any {
        return {};
    }
    public getArlasHubUrl(): string {
        return '';
    }
    public setSettings(): void {
    }
}

/**
 * recursively extract properties for a CollectionReferenceDescription and flatten them with specific separator
 * @param collection collection reference to parse
 * @param separator separator used to flatten data
 * @returns array of CollectionField
 */
export function extractProp(collection: CollectionReferenceDescription, separator = '.'): CollectionField[] {
    const out = [];
    function flatten(x, parent = '') {
        Object.keys(x).forEach(key => {
            const obj = x[key];
            const objName = (parent !== '' ? parent + separator : '') + key;
            if (obj.type === 'OBJECT' && obj.hasOwnProperty('properties')) {
                flatten(obj.properties, objName);
            } else {
                let displayName = '';
                if (collection.params.display_names?.fields?.hasOwnProperty(objName)) {
                    displayName = collection.params.display_names.fields[objName];
                }
                out.push({ name: objName, taggable: obj.taggable, indexed: obj.indexed, type: obj.type, display_name: displayName });
            }
        });
    }
    flatten(collection.properties);
    return out;
}

export class CollectionField {
    public name: string;
    public taggable: boolean;
    public indexed: boolean;
    public type: string;
    public display_name: string;

    public static asFormGroup(field: CollectionField): FormGroup {
        const fg = new FormGroup({
            name: new FormControl(field.name),
            type: new FormControl(field.type),
            display_name: new FormControl(field.display_name),
            taggable: new FormControl(field.taggable),
            indexed: new FormControl(field.indexed)
        });
        return fg;
    }
}

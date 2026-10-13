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

import { FormControl, FormGroup } from '@angular/forms';
import { CollectionReferenceDescription, CollectionReferenceDescriptionProperty } from 'arlas-api';

/**
 * Recursively extracts properties for a CollectionReferenceDescription and flatten them with specific separator
 * @param collection collection reference to parse
 * @param separator separator used to flatten data
 * @returns array of CollectionField
 */
export function extractProp(collection: CollectionReferenceDescription, separator = '.'): CollectionField[] {
    const out = new Array<CollectionField>();
    function flatten(x: Record<string, CollectionReferenceDescriptionProperty> | undefined, parent = '') {
        if (!x) {
            return;
        }

        Object.keys(x).forEach(key => {
            const obj = x[key];
            const objName = (parent !== '' ? parent + separator : '') + key;
            if (obj.type === CollectionReferenceDescriptionProperty.TypeEnum.OBJECT && obj.hasOwnProperty('properties')) {
                flatten(obj.properties, objName);
            } else {
                let displayName = '';
                if (collection.params.display_names?.fields?.hasOwnProperty(objName)) {
                    displayName = collection.params.display_names.fields[objName];
                }
                out.push({
                    name: objName,
                    taggable: !!obj.taggable,
                    indexed: !!obj.indexed,
                    type: obj.type?.toString() as string,
                    display_name: displayName
                });
            }
        });
    }
    flatten(collection.properties);
    return out;
}

export type CollectionFieldFormGroup = FormGroup<{
    name: FormControl<string | null>;
    type: FormControl<string | null>;
    display_name: FormControl<string | null>;
    taggable: FormControl<boolean | null>;
    indexed: FormControl<boolean | null>;
}>;

export class CollectionField {
    public name: string;
    public taggable: boolean;
    public indexed: boolean;
    public type: string;
    public display_name: string;

    public constructor(name: string, taggable: boolean, indexed: boolean, type: string, display_name: string) {
        this.name = name;
        this.taggable = taggable;
        this.indexed = indexed;
        this.type = type;
        this.display_name = display_name;
    }

    public static asFormGroup(field: CollectionField): CollectionFieldFormGroup {
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

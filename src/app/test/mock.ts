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
import { of } from 'rxjs';
import { vi } from 'vitest';

export const mockPermissionService = {
    get: vi.fn(() => of([])),
    createPermissionApiInstance: vi.fn(() => {}),
    setOptions: vi.fn(() => {})
};

export const mockErrorService = {
    emitUnavailableService: vi.fn(() => of({})),
    emitSettingsError: vi.fn(() => {})
};

export const mockArlasSettingsService = {
    getSettings: vi.fn(() => ({})),
    getPersistenceSettings: vi.fn(() => ({})),
    getAuthentSettings: vi.fn(() => ({})),
    setSettings: vi.fn(() => {}),
    getArlasHubUrl: vi.fn(() => ''),
    getPermissionSettings: vi.fn(() => {}),
    getLinksSettings: vi.fn(() => []),
    settings: {}
};

export const mockPersistenceService = {
    get: vi.fn(() => {}),
    list: vi.fn(() => of({}))
};

export const mockArlasStartupService = {
    shouldRunApp: true,
    collectionsMap: new Map()
};

export const mockCollectionService = {
    getCollectionsReferenceDescription: vi.fn(() => of([])),
    setOptions: vi.fn(() => {})
};

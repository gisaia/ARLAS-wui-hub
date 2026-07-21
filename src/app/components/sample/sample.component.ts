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

import { Component, computed, inject, input, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { CollectionReferenceDescription } from 'arlas-api';
import { ArlasCollaborativesearchService } from 'arlas-wui-toolkit';

@Component({
  selector: 'arlas-sample',
  imports: [
    JsonEditorComponent,
    TranslatePipe,
    MatButtonModule,
    MatProgressSpinner
],
  templateUrl: './sample.component.html',
  styleUrl: './sample.component.scss',
})
export class SampleComponent implements OnInit {
  public collection = input.required<CollectionReferenceDescription>();
  private readonly collectionIdPath = computed(() => this.collection().params.id_path);

  public isLoading = signal(false);

  public searchAfter: string | undefined;

  public data: Record<string, any> = {};

  public editorOptions = new JsonEditorOptions();
  @ViewChild('editor', { static: false }) public editor?: JsonEditorComponent;

  private readonly translate = inject(TranslateService);
  private readonly collaborativeSearchService = inject(ArlasCollaborativesearchService);
  private readonly snackbar = inject(MatSnackBar);

  public constructor() {
    this.editorOptions.modes = ['view'];
    this.editorOptions.mode = 'view';
    this.editorOptions.enableSort = true;
    this.editorOptions.enableTransform = false;
    this.editorOptions.expandAll = false;
    this.editorOptions.search = true;

    if (this.translate.getCurrentLang() === 'fr') {
      this.editorOptions.language = 'fr-FR';
    } else {
      this.editorOptions.language = 'en';
    }
  }

  public ngOnInit() {
    this.getSample();
  }

  public getSample(descending?: boolean) {
    this.isLoading.set(true);
    const sort = (descending ? '-' : '') + this.collectionIdPath();
    this.collaborativeSearchService.getExploreApi().search(this.collection().collection_name, undefined, undefined, undefined, undefined,
        undefined, undefined, undefined, undefined, undefined, /** size */ 1, undefined, sort, this.searchAfter)
      .catch(e => console.error(e))
      .then(hits => {
        this.isLoading.set(false);
        if (!hits || !hits.hits || hits.hits.length === 0) {
          this.snackbar.open(
            this.translate.instant(descending ? 'No item found before this item' : 'No item found after this item'), 'Ok',
            {
              duration: 3000, panelClass: 'collection-snack--error',
              horizontalPosition: 'center', verticalPosition: 'bottom'
            }
          );
          return;
        }

        this.data = hits.hits[0].data;
        this.editor?.set(this.data as any);

        this.searchAfter = this.data[this.collectionIdPath()];
      });
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, forwardRef } from '@angular/core';
import { MatButtonModule, MatCardModule, MatTooltipModule } from '@angular/material';

import { AppComponent } from './app.component';
import { LoadService } from './services/load.service';
import { HttpClientModule } from '@angular/common/http';

export function loadServiceFactory(loadService: LoadService) {
  const load = () => loadService.load('config.json?' + Date.now());
  return load;
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    HttpClientModule
  ],
  providers: [
    forwardRef(() => LoadService),
    {
      provide: APP_INITIALIZER,
      useFactory: loadServiceFactory,
      deps: [LoadService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

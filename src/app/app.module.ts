import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BusDeparturesComponent } from './bus-departures/bus-departures.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, BusDeparturesComponent],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BusDeparturesComponent } from './bus-departures/bus-departures.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, BusDeparturesComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

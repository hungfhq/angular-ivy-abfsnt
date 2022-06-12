import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ItemListComponent } from './itemlist.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, ItemListComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

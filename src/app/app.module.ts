import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AppComponent } from './app.component';
import { StoredItemsComponent } from './stored-items/stored-items.component';

import { environment } from './../environments/environment';
import { FridgeItemsService } from './services/fridge-items.service';

@NgModule({
  declarations: [
    AppComponent,
    StoredItemsComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    AngularFontAwesomeModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
  ],
  providers: [FridgeItemsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

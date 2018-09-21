import { ItemType } from './../item';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class FridgeItemsService {

  constructor(private database: AngularFireDatabase) { }

  public getFridgeItems() {
    return this.database.list('/all_items').valueChanges();
  }

  public updateDatabase(new_array_item) {
    this.database.object('/all_items').set(new_array_item);
  }
}

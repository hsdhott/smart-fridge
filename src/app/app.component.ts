import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

import { ItemType } from './item';
import { FridgeItemsService } from './services/fridge-items.service';

const fridge_items1: ItemType[] = [
  {
    itemType: 'dairy',
    items: [
      {
        itemUUID: '11',
        name: 'milk',
        fillFactor: 1
      },
      {
        itemUUID: '12',
        name: 'butter',
        fillFactor: 1
      },
      {
        itemUUID: '13',
        name: 'yogurt',
        fillFactor: 1
      }
    ]
  },
  {
    itemType: 'fruits',
    items: [
      {
        itemUUID: '14',
        name: 'grapes',
        fillFactor: 1
      },
      {
        itemUUID: '15',
        name: 'strawberries',
        fillFactor: 1
      }
    ]
  },
  {
    itemType: 'juices',
    items: [
      {
        itemUUID: '16',
        name: 'orange juice',
        fillFactor: 1
      },
      {
        itemUUID: '17',
        name: 'apple juice',
        fillFactor: 1
      }
    ]
  }
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'smart-fridge';
  private updated_fridge_list;
  public fridge_items = [];
  public get_new_item_out: Subject<any> = new Subject();
  public grocery_list = [];
  public nothing_in_grocery_list = false;

  constructor(
    private items_service: FridgeItemsService
  ) {
    localStorage.removeItem('firebase:previous_websocket_failure');
  }

  getNewItemOut(new_item) {
    this.get_new_item_out.next(new_item);
  }

  getItemsWithLowFill() {
    let items_list = this.updated_fridge_list;
    const item_type_fill = 0;
    this.grocery_list = [];
    this.nothing_in_grocery_list = false;

    if (!items_list) {
      items_list = this.fridge_items;
    }

    for (const category of items_list) {
      let items_total = 0;
      let fill_rate = 0;
      for (const category_item of category.items) {
        fill_rate += category_item.fillFactor;
        items_total++;
      }
      const final_fill_rate = fill_rate / items_total;
      if (final_fill_rate > 0.5) { continue; }
      const item_type_fill_factor = {
        itemType: category.itemType,
        fillFactor: final_fill_rate
      };
      this.grocery_list.push(item_type_fill_factor);

    }
    if (this.grocery_list.length === 0) {
      this.nothing_in_grocery_list = true;
    }
  }

  updateUniversalItemsList(new_list) {
    this.updated_fridge_list = new_list;
    this.items_service.updateDatabase(new_list);
  }

  ngOnInit() {
    this.items_service.getFridgeItems().subscribe(database_fridgte_items => {
      this.fridge_items = database_fridgte_items;
    });
  }
}

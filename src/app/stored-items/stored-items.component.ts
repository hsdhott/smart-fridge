import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ItemType, Item } from './../item';

@Component({
  selector: 'app-stored-items',
  templateUrl: './stored-items.component.html',
  styleUrls: ['./stored-items.component.scss']
})
export class StoredItemsComponent implements OnInit, OnDestroy {
  @Input() universal_fridge_items;
  @Input() get_new_item_out: Subject<any>;

  @Output() updated_universal_fridge_items = new EventEmitter();
  public fridge_items: Item[] = [];
  public items_currently_out = [];
  public unavailable_uuids = [];
  public all_fields_not_filled = false;
  public get_item_out = true;
  public item_did_not_add = false;
  public is_new_item = false;
  public remove_item_from_inventory = false;
  public not_a_unique_uuid = false;
  public not_a_valid_fill_factor = false;
  public new_item_type;
  public new_item_name;
  public new_item_uuid;
  public new_item_fillFactor;
  public added_item_fillrate;
  public returned_item;

  constructor(private modalService: NgbModal) { }

  private checkMandatoryFields() {
    if (!this.new_item_type || !this.new_item_name || !this.new_item_uuid) {
      this.all_fields_not_filled = true;
      return false;
    }

    let check_uuid_index = -1;
    for (let i = 0; i < this.fridge_items.length; i++) {
      if (this.fridge_items[i].itemUUID === this.new_item_uuid) {
        check_uuid_index = i;
      }
      this.unavailable_uuids.push(this.fridge_items[i].itemUUID);
    }
    // const check_uuid_index = this.fridge_items.findIndex(item => {
    //   return item.itemUUID === this.new_item_uuid;
    // });
    console.log(`TESTING THIS ${check_uuid_index}`);

    if (check_uuid_index >= 0 || this.new_item_fillFactor < 0 || this.new_item_fillFactor > 100) {
      if (check_uuid_index >= 0) {
        this.not_a_unique_uuid = true;
      } else {
        this.not_a_valid_fill_factor = true;
      }
      return false;
    }
    return true;
  }

  private createDisplayObjectArray(item_type, uuid, name, fill_factor) {
    return {
      itemType: item_type,
      itemUUID: uuid,
      name: name,
      fillFactor: fill_factor
    };
  }

  private addNewItemToUniversalList(itemType, itemUUID, name, fillFactor) {
    const item_object = {
      itemType: itemType,
      items: [
        {
          itemUUID: itemUUID,
          name: name,
          fillFactor: fillFactor
        }
      ]
    };
    const item_type_index = this.universal_fridge_items.findIndex(item => {
      return item.itemType === itemType;
    });

    if (item_type_index < 0) {
      this.universal_fridge_items.push(item_object);
    } else {
      this.universal_fridge_items[item_type_index].items.push(item_object.items[0]);
    }
    this.emitUpdatedUniversalList(this.universal_fridge_items);
  }

  private emitUpdatedUniversalList(updated_list) {
    this.updated_universal_fridge_items.emit(updated_list);
  }

  private handleItemAdded(itemType, itemUUID, name, fillFactor) {
    this.updateUniversalListfillFactor(itemType, itemUUID, fillFactor);
    const item_object_to_add = this.createDisplayObjectArray(itemType, itemUUID, name, fillFactor);
    this.fridge_items.push(item_object_to_add);

    const added_item_index = this.items_currently_out.findIndex(item => {
      return item.itemUUID === itemUUID;
    });
    this.items_currently_out.splice(added_item_index, 1);
  }

  private updateUniversalListfillFactor(item_type, uuid, fill_factor) {
    for (const category of this.universal_fridge_items) {
      if (category.itemType === item_type) {
        for (const category_item of category.items) {
          if (category_item.itemUUID === uuid) {
            category_item.fillFactor = fill_factor;
            break;
          }
        }
      }
    }
    this.emitUpdatedUniversalList(this.universal_fridge_items);
  }

  private resetNewItemModal() {
    this.new_item_type = null;
    this.new_item_name = null;
    this.new_item_uuid = null;
    this.new_item_fillFactor = null;
  }

  private resetErrors() {
    this.all_fields_not_filled = false;
    this.not_a_unique_uuid = false;
    this.not_a_valid_fill_factor = false;
    this.item_did_not_add = false;
  }

  public addItemBack(item, content, is_new_item?) {
    this.is_new_item = is_new_item;
    if (!is_new_item) {
      this.returned_item = item;
      this.added_item_fillrate = item.fillFactor * 100;
    }
    this.resetErrors();
    this.modalService.open(content).result.then((result) => {
      if (this.added_item_fillrate < 0 || this.added_item_fillrate > 100) {
        this.item_did_not_add = true;
        return;
      }
      if (is_new_item) {
        if (!this.checkMandatoryFields()) {
          return;
        }
        const new_fill_factor = this.new_item_fillFactor / 100;
        const mapped_new_item_type = this.new_item_type.toLowerCase();
        const mapped_new_name = this.new_item_name.toLowerCase();
        this.handleItemAdded(mapped_new_item_type, this.new_item_uuid, mapped_new_name, new_fill_factor);
        this.addNewItemToUniversalList(mapped_new_item_type, this.new_item_uuid, mapped_new_name, new_fill_factor);
        this.resetNewItemModal();
      } else {
        const new_fill_factor = this.added_item_fillrate / 100;
        this.handleItemAdded(item.itemType, item.itemUUID, item.name, new_fill_factor);
      }
      this.added_item_fillrate = null;
    }, (reason) => {
      this.item_did_not_add = true;
    });
  }

  public forgetItem(item) {
    const index_of_fridge_items = this.fridge_items.indexOf(item);
    for (const category of this.universal_fridge_items) {
      for (let i = 0; i < category.items.length; i++) {
        if (category.items[i].itemUUID === item.itemUUID) {
          category.items.splice(i, 1);
        }
      }
    }
    this.fridge_items.splice(index_of_fridge_items, 1);
    this.emitUpdatedUniversalList(this.universal_fridge_items);
  }

  public handleItemRemoved(item) {
    const item_index = this.fridge_items.indexOf(item);
    const removed_item = this.fridge_items.splice(item_index, 1);
    this.updateUniversalListfillFactor(item.itemType, item.itemUUID, 0);
    this.items_currently_out.push(removed_item[0]);
  }

  ngOnInit() {
    if (!this.universal_fridge_items) {
      return;
    }
    for (const category of this.universal_fridge_items) {
      for (const category_items of category.items) {
        const fridge_item_object = this.createDisplayObjectArray(category.itemType, category_items.itemUUID, category_items.name, category_items.fillFactor);
        this.fridge_items.push(fridge_item_object);
      }
    }

    this.get_new_item_out.subscribe(event => {
      this.get_item_out = false;
    });
  }

  ngOnDestroy() {
    this.get_new_item_out.unsubscribe();
  }
}

export interface Item {
  itemType: string;
  itemUUID: string;
  name: string;
  fillFactor: number;
}

export interface ItemType {
  itemType: string;
  items: ItemTypeFactor[];
}

export interface ItemTypeFactor {
  itemUUID: string;
  name: string;
  fillFactor: number;
}


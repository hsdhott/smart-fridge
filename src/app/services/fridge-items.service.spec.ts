import { TestBed, inject } from '@angular/core/testing';

import { FridgeItemsService } from './fridge-items.service';

describe('FridgeItemsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FridgeItemsService]
    });
  });

  it('should be created', inject([FridgeItemsService], (service: FridgeItemsService) => {
    expect(service).toBeTruthy();
  }));
});

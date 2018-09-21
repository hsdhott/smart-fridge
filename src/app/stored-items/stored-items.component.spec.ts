import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoredItemsComponent } from './stored-items.component';

describe('StoredItemsComponent', () => {
  let component: StoredItemsComponent;
  let fixture: ComponentFixture<StoredItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoredItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoredItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

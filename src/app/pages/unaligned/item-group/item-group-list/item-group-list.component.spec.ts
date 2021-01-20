import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemGroupListComponent } from './item-group-list.component';

describe('ItemGroupListComponent', () => {
  let component: ItemGroupListComponent;
  let fixture: ComponentFixture<ItemGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

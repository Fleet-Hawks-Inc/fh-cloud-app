import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelEntryListComponent } from './fuel-entry-list.component';

describe('FuelEntryListComponent', () => {
  let component: FuelEntryListComponent;
  let fixture: ComponentFixture<FuelEntryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelEntryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelEntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

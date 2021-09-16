import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FuelEntryListComponent } from './fuel-entry-list.component';

describe('FuelEntryListComponent', () => {
  let component: FuelEntryListComponent;
  let fixture: ComponentFixture<FuelEntryListComponent>;

  beforeEach(waitForAsync(() => {
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

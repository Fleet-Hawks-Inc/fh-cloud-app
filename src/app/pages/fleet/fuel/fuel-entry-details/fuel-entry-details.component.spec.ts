import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelEntryDetailsComponent } from './fuel-entry-details.component';

describe('FuelEntryDetailsComponent', () => {
  let component: FuelEntryDetailsComponent;
  let fixture: ComponentFixture<FuelEntryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelEntryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelEntryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

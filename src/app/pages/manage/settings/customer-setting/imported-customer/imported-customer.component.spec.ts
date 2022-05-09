import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedCustomerComponent } from './imported-customer.component';

describe('ImportedCustomerComponent', () => {
  let component: ImportedCustomerComponent;
  let fixture: ComponentFixture<ImportedCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportedCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportedCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

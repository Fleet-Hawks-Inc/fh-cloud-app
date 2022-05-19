import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedCustomerComponent } from './deleted-customer.component';

describe('DeletedCustomerComponent', () => {
  let component: DeletedCustomerComponent;
  let fixture: ComponentFixture<DeletedCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletedCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletedCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

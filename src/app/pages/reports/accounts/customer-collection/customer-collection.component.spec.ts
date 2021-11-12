import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCollectionComponent } from './customer-collection.component';

describe('CustomerCollectionComponent', () => {
  let component: CustomerCollectionComponent;
  let fixture: ComponentFixture<CustomerCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

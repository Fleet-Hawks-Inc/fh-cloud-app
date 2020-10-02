import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContactRenewComponent } from './add-contact-renew.component';

describe('AddContactRenewComponent', () => {
  let component: AddContactRenewComponent;
  let fixture: ComponentFixture<AddContactRenewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddContactRenewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContactRenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

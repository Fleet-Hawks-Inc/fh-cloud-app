import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactRenewalsComponent } from './contact-renewals.component';

describe('ContactRenewalsComponent', () => {
  let component: ContactRenewalsComponent;
  let fixture: ComponentFixture<ContactRenewalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactRenewalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactRenewalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

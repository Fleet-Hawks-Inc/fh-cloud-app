import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactRenewDetailComponent } from './contact-renew-detail.component';

describe('ContactRenewDetailComponent', () => {
  let component: ContactRenewDetailComponent;
  let fixture: ComponentFixture<ContactRenewDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactRenewDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactRenewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

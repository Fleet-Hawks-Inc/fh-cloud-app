import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListContactRenewComponent } from './list-contact-renew.component';

describe('ListContactRenewComponent', () => {
  let component: ListContactRenewComponent;
  let fixture: ComponentFixture<ListContactRenewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListContactRenewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListContactRenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

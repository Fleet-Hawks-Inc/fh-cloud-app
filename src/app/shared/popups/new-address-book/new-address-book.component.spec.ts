import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAddressBookComponent } from './new-address-book.component';

describe('NewAddressBookComponent', () => {
  let component: NewAddressBookComponent;
  let fixture: ComponentFixture<NewAddressBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAddressBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAddressBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

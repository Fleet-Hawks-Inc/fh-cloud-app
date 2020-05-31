import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiverAddressListComponent } from './receiver-address-list.component';

describe('ReceiverAddressListComponent', () => {
  let component: ReceiverAddressListComponent;
  let fixture: ComponentFixture<ReceiverAddressListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiverAddressListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiverAddressListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoringCompanyAddressListComponent } from './factoring-company-address-list.component';

describe('FactoringCompanyAddressListComponent', () => {
  let component: FactoringCompanyAddressListComponent;
  let fixture: ComponentFixture<FactoringCompanyAddressListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoringCompanyAddressListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoringCompanyAddressListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFactoringCompanyAddressComponent } from './edit-factoring-company-address.component';

describe('EditFactoringCompanyAddressComponent', () => {
  let component: EditFactoringCompanyAddressComponent;
  let fixture: ComponentFixture<EditFactoringCompanyAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFactoringCompanyAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFactoringCompanyAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

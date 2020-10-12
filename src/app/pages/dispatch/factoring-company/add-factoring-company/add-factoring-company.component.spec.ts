import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFactoringCompanyComponent } from './add-factoring-company.component';

describe('AddFactoringCompanyComponent', () => {
  let component: AddFactoringCompanyComponent;
  let fixture: ComponentFixture<AddFactoringCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFactoringCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFactoringCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

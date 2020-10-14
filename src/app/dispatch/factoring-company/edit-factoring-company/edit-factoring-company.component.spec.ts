import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFactoringCompanyComponent } from './edit-factoring-company.component';

describe('EditFactoringCompanyComponent', () => {
  let component: EditFactoringCompanyComponent;
  let fixture: ComponentFixture<EditFactoringCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFactoringCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFactoringCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

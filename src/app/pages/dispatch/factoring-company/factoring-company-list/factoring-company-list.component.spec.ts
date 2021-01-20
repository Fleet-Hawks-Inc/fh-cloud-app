import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoringCompanyListComponent } from './factoring-company-list.component';

describe('FactoringCompanyListComponent', () => {
  let component: FactoringCompanyListComponent;
  let fixture: ComponentFixture<FactoringCompanyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoringCompanyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoringCompanyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

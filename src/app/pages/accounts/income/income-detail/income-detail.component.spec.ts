import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeDetailComponent } from './income-detail.component';

describe('IncomeDetailComponent', () => {
  let component: IncomeDetailComponent;
  let fixture: ComponentFixture<IncomeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

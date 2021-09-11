import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IncomeListComponent } from './income-list.component';

describe('IncomeListComponent', () => {
  let component: IncomeListComponent;
  let fixture: ComponentFixture<IncomeListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

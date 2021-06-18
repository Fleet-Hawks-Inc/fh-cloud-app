import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartOfAccountsDetailsComponent } from './chart-of-accounts-details.component';

describe('ChartOfAccountsDetailsComponent', () => {
  let component: ChartOfAccountsDetailsComponent;
  let fixture: ComponentFixture<ChartOfAccountsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartOfAccountsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartOfAccountsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

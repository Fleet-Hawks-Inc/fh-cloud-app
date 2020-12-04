import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartAccountsDetailsComponent } from './chart-accounts-details.component';

describe('ChartAccountsDetailsComponent', () => {
  let component: ChartAccountsDetailsComponent;
  let fixture: ComponentFixture<ChartAccountsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartAccountsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartAccountsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

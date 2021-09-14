import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GeneralLedgerDetailComponent } from './general-ledger-detail.component';

describe('GeneralLedgerDetailComponent', () => {
  let component: GeneralLedgerDetailComponent;
  let fixture: ComponentFixture<GeneralLedgerDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralLedgerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralLedgerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

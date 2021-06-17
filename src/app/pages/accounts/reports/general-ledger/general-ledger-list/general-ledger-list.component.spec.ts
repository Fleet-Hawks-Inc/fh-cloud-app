import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralLedgerListComponent } from './general-ledger-list.component';

describe('GeneralLedgerListComponent', () => {
  let component: GeneralLedgerListComponent;
  let fixture: ComponentFixture<GeneralLedgerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralLedgerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralLedgerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SalesReceiptsDetailComponent } from './sales-receipts-detail.component';

describe('SalesReceiptsDetailComponent', () => {
  let component: SalesReceiptsDetailComponent;
  let fixture: ComponentFixture<SalesReceiptsDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesReceiptsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesReceiptsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

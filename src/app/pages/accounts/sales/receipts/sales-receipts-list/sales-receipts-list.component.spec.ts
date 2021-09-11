import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SalesReceiptsListComponent } from './sales-receipts-list.component';

describe('SalesReceiptsListComponent', () => {
  let component: SalesReceiptsListComponent;
  let fixture: ComponentFixture<SalesReceiptsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesReceiptsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesReceiptsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

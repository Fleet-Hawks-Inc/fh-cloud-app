import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReceiptsListComponent } from './receipts-list.component';

describe('ReceiptsListComponent', () => {
  let component: ReceiptsListComponent;
  let fixture: ComponentFixture<ReceiptsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

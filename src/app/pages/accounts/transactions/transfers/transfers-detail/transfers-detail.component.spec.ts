import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransfersDetailComponent } from './transfers-detail.component';

describe('TransfersDetailComponent', () => {
  let component: TransfersDetailComponent;
  let fixture: ComponentFixture<TransfersDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfersDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

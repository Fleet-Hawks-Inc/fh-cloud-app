import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FdreportComponent } from './fdreport.component';

describe('FdreportComponent', () => {
  let component: FdreportComponent;
  let fixture: ComponentFixture<FdreportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FdreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FdreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

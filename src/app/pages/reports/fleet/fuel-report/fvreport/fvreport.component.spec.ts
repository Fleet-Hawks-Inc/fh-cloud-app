import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FvreportComponent } from './fvreport.component';

describe('FvreportComponent', () => {
  let component: FvreportComponent;
  let fixture: ComponentFixture<FvreportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FvreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FvreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

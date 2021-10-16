import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IslogsreportComponent } from './islogsreport.component';

describe('IslogsreportComponent', () => {
  let component: IslogsreportComponent;
  let fixture: ComponentFixture<IslogsreportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IslogsreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IslogsreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

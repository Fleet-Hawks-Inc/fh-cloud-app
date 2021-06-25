import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IslogsreportComponent } from './islogsreport.component';

describe('IslogsreportComponent', () => {
  let component: IslogsreportComponent;
  let fixture: ComponentFixture<IslogsreportComponent>;

  beforeEach(async(() => {
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

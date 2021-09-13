import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CedetailComponent } from './cedetail.component';

describe('CedetailComponent', () => {
  let component: CedetailComponent;
  let fixture: ComponentFixture<CedetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CedetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PdetailComponent } from './pdetail.component';

describe('PdetailComponent', () => {
  let component: PdetailComponent;
  let fixture: ComponentFixture<PdetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

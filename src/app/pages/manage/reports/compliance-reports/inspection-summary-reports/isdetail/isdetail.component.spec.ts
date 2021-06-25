import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsdetailComponent } from './isdetail.component';

describe('IsdetailComponent', () => {
  let component: IsdetailComponent;
  let fixture: ComponentFixture<IsdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

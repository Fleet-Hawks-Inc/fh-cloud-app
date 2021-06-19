import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdetailComponent } from './pdetail.component';

describe('PdetailComponent', () => {
  let component: PdetailComponent;
  let fixture: ComponentFixture<PdetailComponent>;

  beforeEach(async(() => {
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

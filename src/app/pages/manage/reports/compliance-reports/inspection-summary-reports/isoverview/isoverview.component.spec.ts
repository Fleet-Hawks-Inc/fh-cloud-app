import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsoverviewComponent } from './isoverview.component';

describe('IsoverviewComponent', () => {
  let component: IsoverviewComponent;
  let fixture: ComponentFixture<IsoverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsoverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

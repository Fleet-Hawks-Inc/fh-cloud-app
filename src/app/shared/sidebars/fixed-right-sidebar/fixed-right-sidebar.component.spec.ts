import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FixedRightSidebarComponent } from './fixed-right-sidebar.component';

describe('FixedRightSidebarComponent', () => {
  let component: FixedRightSidebarComponent;
  let fixture: ComponentFixture<FixedRightSidebarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedRightSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedRightSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

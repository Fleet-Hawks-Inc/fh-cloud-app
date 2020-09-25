import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedRightSidebarComponent } from './fixed-right-sidebar.component';

describe('FixedRightSidebarComponent', () => {
  let component: FixedRightSidebarComponent;
  let fixture: ComponentFixture<FixedRightSidebarComponent>;

  beforeEach(async(() => {
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

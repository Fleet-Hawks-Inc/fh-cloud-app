import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardDriverComponent } from './dashboard-driver.component';

describe('DashboardDriverComponent', () => {
  let component: DashboardDriverComponent;
  let fixture: ComponentFixture<DashboardDriverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardDriverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

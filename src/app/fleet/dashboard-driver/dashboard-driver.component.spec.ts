import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDriverComponent } from './dashboard-driver.component';

describe('DashboardDriverComponent', () => {
  let component: DashboardDriverComponent;
  let fixture: ComponentFixture<DashboardDriverComponent>;

  beforeEach(async(() => {
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDashboardComponent } from './load-dashboard.component';

describe('LoadDashboardComponent', () => {
  let component: LoadDashboardComponent;
  let fixture: ComponentFixture<LoadDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

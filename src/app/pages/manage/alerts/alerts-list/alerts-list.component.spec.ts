import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlertsListComponent } from './alerts-list.component';

describe('AlertsListComponent', () => {
  let component: AlertsListComponent;
  let fixture: ComponentFixture<AlertsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

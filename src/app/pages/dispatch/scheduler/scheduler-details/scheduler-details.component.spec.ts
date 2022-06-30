import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerDetailsComponent } from './scheduler-details.component';

describe('SchedulerDetailsComponent', () => {
  let component: SchedulerDetailsComponent;
  let fixture: ComponentFixture<SchedulerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedulerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

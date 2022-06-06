import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSchedulerComponent } from './add-scheduler.component';

describe('AddSchedulerComponent', () => {
  let component: AddSchedulerComponent;
  let fixture: ComponentFixture<AddSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSchedulerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

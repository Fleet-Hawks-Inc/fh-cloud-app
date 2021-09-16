import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UtilizationComponent } from './utilization.component';

describe('UtilizationComponent', () => {
  let component: UtilizationComponent;
  let fixture: ComponentFixture<UtilizationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

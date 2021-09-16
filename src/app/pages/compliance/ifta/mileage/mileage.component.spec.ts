import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MileageComponent } from './mileage.component';

describe('MileageComponent', () => {
  let component: MileageComponent;
  let fixture: ComponentFixture<MileageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MileageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MileageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

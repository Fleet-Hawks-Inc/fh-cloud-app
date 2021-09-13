import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AllCarriersComponent } from './all-carriers.component';

describe('AllCarriersComponent', () => {
  let component: AllCarriersComponent;
  let fixture: ComponentFixture<AllCarriersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AllCarriersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCarriersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

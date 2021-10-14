import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HDetailComponent } from './h-detail.component';

describe('HDetailComponent', () => {
  let component: HDetailComponent;
  let fixture: ComponentFixture<HDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

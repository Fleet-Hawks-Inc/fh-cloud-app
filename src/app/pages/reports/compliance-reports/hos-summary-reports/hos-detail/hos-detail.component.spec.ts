import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HosDetailComponent } from './hos-detail.component';

describe('HosDetailComponent', () => {
  let component: HosDetailComponent;
  let fixture: ComponentFixture<HosDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HosDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HosDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

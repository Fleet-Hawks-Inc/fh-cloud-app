import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UncertifiedComponent } from './uncertified.component';

describe('UncertifiedComponent', () => {
  let component: UncertifiedComponent;
  let fixture: ComponentFixture<UncertifiedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UncertifiedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UncertifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

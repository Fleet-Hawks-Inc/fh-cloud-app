import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HSummaryComponent } from './h-summary.component';

describe('HSummaryComponent', () => {
  let component: HSummaryComponent;
  let fixture: ComponentFixture<HSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

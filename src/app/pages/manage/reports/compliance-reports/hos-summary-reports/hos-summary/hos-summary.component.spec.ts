import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HosSummaryComponent } from './hos-summary.component';

describe('HosSummaryComponent', () => {
  let component: HosSummaryComponent;
  let fixture: ComponentFixture<HosSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HosSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HosSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

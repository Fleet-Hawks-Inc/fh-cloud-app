import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HosOverviewComponent } from './hos-overview.component';

describe('HosOverviewComponent', () => {
  let component: HosOverviewComponent;
  let fixture: ComponentFixture<HosOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HosOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HosOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

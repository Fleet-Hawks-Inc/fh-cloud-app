import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HOverviewComponent } from './h-overview.component';

describe('HOverviewComponent', () => {
  let component: HOverviewComponent;
  let fixture: ComponentFixture<HOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UlOverviewComponent } from './ul-overview.component';

describe('UlOverviewComponent', () => {
  let component: UlOverviewComponent;
  let fixture: ComponentFixture<UlOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UlOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UlOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

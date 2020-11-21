import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchOverviewComponent } from './dispatch-overview.component';

describe('DispatchOverviewComponent', () => {
  let component: DispatchOverviewComponent;
  let fixture: ComponentFixture<DispatchOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispatchOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OverviewroutesComponent } from './overviewroutes.component';

describe('OverviewroutesComponent', () => {
  let component: OverviewroutesComponent;
  let fixture: ComponentFixture<OverviewroutesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewroutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewroutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

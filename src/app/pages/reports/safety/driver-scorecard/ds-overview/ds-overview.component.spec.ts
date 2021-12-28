import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DsOverviewComponent } from './ds-overview.component';

describe('DsOverviewComponent', () => {
  let component: DsOverviewComponent;
  let fixture: ComponentFixture<DsOverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DsOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

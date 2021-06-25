import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DsOverviewComponent } from './ds-overview.component';

describe('DsOverviewComponent', () => {
  let component: DsOverviewComponent;
  let fixture: ComponentFixture<DsOverviewComponent>;

  beforeEach(async(() => {
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

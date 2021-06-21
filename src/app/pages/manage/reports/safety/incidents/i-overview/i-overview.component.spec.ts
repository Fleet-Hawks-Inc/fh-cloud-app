import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IOverviewComponent } from './i-overview.component';

describe('IOverviewComponent', () => {
  let component: IOverviewComponent;
  let fixture: ComponentFixture<IOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

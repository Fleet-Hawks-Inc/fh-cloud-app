import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssummaryComponent } from './issummary.component';

describe('IssummaryComponent', () => {
  let component: IssummaryComponent;
  let fixture: ComponentFixture<IssummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

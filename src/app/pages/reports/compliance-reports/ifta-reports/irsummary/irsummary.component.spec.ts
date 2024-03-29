import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IrsummaryComponent } from './irsummary.component';

describe('IrsummaryComponent', () => {
  let component: IrsummaryComponent;
  let fixture: ComponentFixture<IrsummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IrsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IrsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

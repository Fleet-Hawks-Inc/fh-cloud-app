import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLoadsComponent } from './all-loads.component';

describe('AllLoadsComponent', () => {
  let component: AllLoadsComponent;
  let fixture: ComponentFixture<AllLoadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllLoadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllLoadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

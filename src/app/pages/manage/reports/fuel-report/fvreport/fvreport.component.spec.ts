import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FvreportComponent } from './fvreport.component';

describe('FvreportComponent', () => {
  let component: FvreportComponent;
  let fixture: ComponentFixture<FvreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FvreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FvreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

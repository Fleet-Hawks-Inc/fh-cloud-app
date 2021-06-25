import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HDetailComponent } from './h-detail.component';

describe('HDetailComponent', () => {
  let component: HDetailComponent;
  let fixture: ComponentFixture<HDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

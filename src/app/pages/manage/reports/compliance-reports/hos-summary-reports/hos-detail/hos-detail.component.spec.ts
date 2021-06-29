import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HosDetailComponent } from './hos-detail.component';

describe('HosDetailComponent', () => {
  let component: HosDetailComponent;
  let fixture: ComponentFixture<HosDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HosDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HosDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

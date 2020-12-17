import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertTypeDetailComponent } from './alert-type-detail.component';

describe('AlertTypeDetailComponent', () => {
  let component: AlertTypeDetailComponent;
  let fixture: ComponentFixture<AlertTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertTypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

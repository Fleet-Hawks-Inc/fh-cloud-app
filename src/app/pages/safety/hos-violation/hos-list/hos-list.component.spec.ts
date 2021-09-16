import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HosListComponent } from './hos-list.component';

describe('HosListComponent', () => {
  let component: HosListComponent;
  let fixture: ComponentFixture<HosListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SharedModalsComponent } from './shared-modals.component';

describe('SharedModalsComponent', () => {
  let component: SharedModalsComponent;
  let fixture: ComponentFixture<SharedModalsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

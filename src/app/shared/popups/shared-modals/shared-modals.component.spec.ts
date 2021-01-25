import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModalsComponent } from './shared-modals.component';

describe('SharedModalsComponent', () => {
  let component: SharedModalsComponent;
  let fixture: ComponentFixture<SharedModalsComponent>;

  beforeEach(async(() => {
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

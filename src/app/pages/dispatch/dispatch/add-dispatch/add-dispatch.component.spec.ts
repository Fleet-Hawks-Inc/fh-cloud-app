import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDispatchComponent } from './add-dispatch.component';

describe('AddDispatchComponent', () => {
  let component: AddDispatchComponent;
  let fixture: ComponentFixture<AddDispatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDispatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

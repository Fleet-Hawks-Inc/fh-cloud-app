import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStateComponent } from './add-state.component';

describe('AddStateComponent', () => {
  let component: AddStateComponent;
  let fixture: ComponentFixture<AddStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

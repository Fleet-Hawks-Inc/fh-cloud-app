import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuantumComponent } from './add-quantum.component';

describe('AddQuantumComponent', () => {
  let component: AddQuantumComponent;
  let fixture: ComponentFixture<AddQuantumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddQuantumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddQuantumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

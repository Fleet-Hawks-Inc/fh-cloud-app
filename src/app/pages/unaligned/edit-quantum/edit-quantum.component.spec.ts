import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQuantumComponent } from './edit-quantum.component';

describe('EditQuantumComponent', () => {
  let component: EditQuantumComponent;
  let fixture: ComponentFixture<EditQuantumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditQuantumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditQuantumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

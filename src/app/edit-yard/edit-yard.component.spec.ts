import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditYardComponent } from './edit-yard.component';

describe('EditYardComponent', () => {
  let component: EditYardComponent;
  let fixture: ComponentFixture<EditYardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditYardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditYardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

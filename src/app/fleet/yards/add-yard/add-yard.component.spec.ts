import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddYardComponent } from './add-yard.component';

describe('AddYardComponent', () => {
  let component: AddYardComponent;
  let fixture: ComponentFixture<AddYardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddYardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddYardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

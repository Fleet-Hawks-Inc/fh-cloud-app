import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAlertComponent } from './edit-alert.component';

describe('EditAlertComponent', () => {
  let component: EditAlertComponent;
  let fixture: ComponentFixture<EditAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

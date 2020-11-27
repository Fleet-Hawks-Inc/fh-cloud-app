import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIncidentComponent } from './edit-incident.component';

describe('EditIncidentComponent', () => {
  let component: EditIncidentComponent;
  let fixture: ComponentFixture<EditIncidentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditIncidentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

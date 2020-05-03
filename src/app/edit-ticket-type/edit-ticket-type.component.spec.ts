import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTicketTypeComponent } from './edit-ticket-type.component';

describe('EditTicketTypeComponent', () => {
  let component: EditTicketTypeComponent;
  let fixture: ComponentFixture<EditTicketTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTicketTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTicketTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

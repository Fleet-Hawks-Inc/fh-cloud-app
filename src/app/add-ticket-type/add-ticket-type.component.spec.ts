import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTicketTypeComponent } from './add-ticket-type.component';

describe('AddTicketTypeComponent', () => {
  let component: AddTicketTypeComponent;
  let fixture: ComponentFixture<AddTicketTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTicketTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTicketTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

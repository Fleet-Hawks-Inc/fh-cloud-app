import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketTypeListComponent } from './ticket-type-list.component';

describe('TicketTypeListComponent', () => {
  let component: TicketTypeListComponent;
  let fixture: ComponentFixture<TicketTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

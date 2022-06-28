import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerPayComponent } from './employer-pay.component';

describe('EmployerPayComponent', () => {
  let component: EmployerPayComponent;
  let fixture: ComponentFixture<EmployerPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerPayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

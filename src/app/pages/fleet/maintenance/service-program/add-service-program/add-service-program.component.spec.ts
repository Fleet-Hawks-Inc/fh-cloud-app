import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServiceProgramComponent } from './add-service-program.component';

describe('AddServiceProgramComponent', () => {
  let component: AddServiceProgramComponent;
  let fixture: ComponentFixture<AddServiceProgramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddServiceProgramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddServiceProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

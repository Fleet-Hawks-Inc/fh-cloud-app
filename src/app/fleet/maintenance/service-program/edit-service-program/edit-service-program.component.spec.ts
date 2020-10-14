import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditServiceProgramComponent } from './edit-service-program.component';

describe('EditServiceProgramComponent', () => {
  let component: EditServiceProgramComponent;
  let fixture: ComponentFixture<EditServiceProgramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditServiceProgramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditServiceProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RFormsComponent } from './r-forms.component';

describe('RFormsComponent', () => {
  let component: RFormsComponent;
  let fixture: ComponentFixture<RFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

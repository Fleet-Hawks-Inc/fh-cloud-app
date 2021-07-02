import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UlFormMannerComponent } from './ul-form-manner.component';

describe('UlFormMannerComponent', () => {
  let component: UlFormMannerComponent;
  let fixture: ComponentFixture<UlFormMannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UlFormMannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UlFormMannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

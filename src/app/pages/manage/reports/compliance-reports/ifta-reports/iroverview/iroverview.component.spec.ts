import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IroverviewComponent } from './iroverview.component';

describe('IroverviewComponent', () => {
  let component: IroverviewComponent;
  let fixture: ComponentFixture<IroverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IroverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IroverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

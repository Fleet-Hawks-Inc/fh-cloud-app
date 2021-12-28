import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IroverviewComponent } from './iroverview.component';

describe('IroverviewComponent', () => {
  let component: IroverviewComponent;
  let fixture: ComponentFixture<IroverviewComponent>;

  beforeEach(waitForAsync(() => {
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

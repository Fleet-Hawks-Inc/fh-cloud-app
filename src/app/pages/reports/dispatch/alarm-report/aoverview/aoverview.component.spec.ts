import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AoverviewComponent } from './aoverview.component';

describe('AoverviewComponent', () => {
  let component: AoverviewComponent;
  let fixture: ComponentFixture<AoverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AoverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoverviewComponent } from './boverview.component';

describe('BoverviewComponent', () => {
  let component: BoverviewComponent;
  let fixture: ComponentFixture<BoverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

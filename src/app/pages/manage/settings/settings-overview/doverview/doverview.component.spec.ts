import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoverviewComponent } from './doverview.component';

describe('DoverviewComponent', () => {
  let component: DoverviewComponent;
  let fixture: ComponentFixture<DoverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

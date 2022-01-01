import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalMilesComponent } from './total-miles.component';

describe('TotalMilesComponent', () => {
  let component: TotalMilesComponent;
  let fixture: ComponentFixture<TotalMilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalMilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalMilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

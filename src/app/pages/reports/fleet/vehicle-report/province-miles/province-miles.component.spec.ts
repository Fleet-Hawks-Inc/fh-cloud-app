import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinceMilesComponent } from './province-miles.component';

describe('ProvinceMilesComponent', () => {
  let component: ProvinceMilesComponent;
  let fixture: ComponentFixture<ProvinceMilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvinceMilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvinceMilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

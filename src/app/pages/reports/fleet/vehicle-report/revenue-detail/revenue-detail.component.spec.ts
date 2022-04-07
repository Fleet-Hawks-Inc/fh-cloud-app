import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueDetailComponent } from './revenue-detail.component';

describe('RevenueDetailComponent', () => {
  let component: RevenueDetailComponent;
  let fixture: ComponentFixture<RevenueDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevenueDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

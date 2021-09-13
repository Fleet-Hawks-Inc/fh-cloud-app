import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DsDetailComponent } from './ds-detail.component';

describe('DsDetailComponent', () => {
  let component: DsDetailComponent;
  let fixture: ComponentFixture<DsDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

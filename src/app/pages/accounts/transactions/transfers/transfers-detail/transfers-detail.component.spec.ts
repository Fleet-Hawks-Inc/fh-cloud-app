import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfersDetailComponent } from './transfers-detail.component';

describe('TransfersDetailComponent', () => {
  let component: TransfersDetailComponent;
  let fixture: ComponentFixture<TransfersDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfersDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

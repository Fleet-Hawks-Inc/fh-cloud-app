import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokeragePdfComponent } from './brokerage-pdf.component';

describe('BrokeragePdfComponent', () => {
  let component: BrokeragePdfComponent;
  let fixture: ComponentFixture<BrokeragePdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokeragePdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokeragePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

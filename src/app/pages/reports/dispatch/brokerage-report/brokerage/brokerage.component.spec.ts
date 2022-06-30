import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerageComponent } from './brokerage.component';

describe('BrokerageComponent', () => {
  let component: BrokerageComponent;
  let fixture: ComponentFixture<BrokerageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

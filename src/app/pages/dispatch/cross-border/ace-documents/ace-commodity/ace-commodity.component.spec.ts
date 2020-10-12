import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AceCommodityComponent } from './ace-commodity.component';

describe('AceCommodityComponent', () => {
  let component: AceCommodityComponent;
  let fixture: ComponentFixture<AceCommodityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AceCommodityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AceCommodityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

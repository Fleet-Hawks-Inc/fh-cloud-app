import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AciCommodityComponent } from './aci-commodity.component';

describe('AciCommodityComponent', () => {
  let component: AciCommodityComponent;
  let fixture: ComponentFixture<AciCommodityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AciCommodityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AciCommodityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

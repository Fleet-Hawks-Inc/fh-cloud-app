import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPdfAnnotationComponent } from './order-pdf-annotation.component';

describe('OrderPdfAnnotationComponent', () => {
  let component: OrderPdfAnnotationComponent;
  let fixture: ComponentFixture<OrderPdfAnnotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPdfAnnotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPdfAnnotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

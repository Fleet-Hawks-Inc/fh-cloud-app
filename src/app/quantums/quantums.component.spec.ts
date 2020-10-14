import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantumsComponent } from './quantums.component';

describe('QuantumsComponent', () => {
  let component: QuantumsComponent;
  let fixture: ComponentFixture<QuantumsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuantumsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

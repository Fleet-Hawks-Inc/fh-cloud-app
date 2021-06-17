import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailreportComponent } from './detailreport.component';

describe('DetailreportComponent', () => {
  let component: DetailreportComponent;
  let fixture: ComponentFixture<DetailreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

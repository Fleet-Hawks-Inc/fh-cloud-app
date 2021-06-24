import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IDetailComponent } from './i-detail.component';

describe('IDetailComponent', () => {
  let component: IDetailComponent;
  let fixture: ComponentFixture<IDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

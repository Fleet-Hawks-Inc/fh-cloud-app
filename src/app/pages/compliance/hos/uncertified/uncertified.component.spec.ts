import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UncertifiedComponent } from './uncertified.component';

describe('UncertifiedComponent', () => {
  let component: UncertifiedComponent;
  let fixture: ComponentFixture<UncertifiedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UncertifiedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UncertifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

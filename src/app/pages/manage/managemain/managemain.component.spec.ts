import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManagemainComponent } from './managemain.component';

describe('ManagemainComponent', () => {
  let component: ManagemainComponent;
  let fixture: ComponentFixture<ManagemainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagemainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagemainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDispatchComponent } from './all-dispatch.component';

describe('AllDispatchComponent', () => {
  let component: AllDispatchComponent;
  let fixture: ComponentFixture<AllDispatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllDispatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

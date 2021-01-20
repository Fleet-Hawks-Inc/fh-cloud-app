import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLoadComponent } from './create-load.component';

describe('CreateLoadComponent', () => {
  let component: CreateLoadComponent;
  let fixture: ComponentFixture<CreateLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

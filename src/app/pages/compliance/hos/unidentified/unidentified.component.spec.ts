import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnidentifiedComponent } from './unidentified.component';

describe('UnidentifiedComponent', () => {
  let component: UnidentifiedComponent;
  let fixture: ComponentFixture<UnidentifiedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UnidentifiedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidentifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionOnboardComponent } from './subscription-onboard.component';

describe('SubscriptionOnboardComponent', () => {
  let component: SubscriptionOnboardComponent;
  let fixture: ComponentFixture<SubscriptionOnboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionOnboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionOnboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

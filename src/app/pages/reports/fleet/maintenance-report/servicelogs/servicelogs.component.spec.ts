import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServicelogsComponent } from './servicelogs.component';

describe('ServicelogsComponent', () => {
  let component: ServicelogsComponent;
  let fixture: ComponentFixture<ServicelogsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicelogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicelogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

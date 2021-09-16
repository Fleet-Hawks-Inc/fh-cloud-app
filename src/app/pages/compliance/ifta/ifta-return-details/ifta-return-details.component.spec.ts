import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IftaReturnDetailsComponent } from './ifta-return-details.component';

describe('IftaReturnDetailsComponent', () => {
  let component: IftaReturnDetailsComponent;
  let fixture: ComponentFixture<IftaReturnDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IftaReturnDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IftaReturnDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

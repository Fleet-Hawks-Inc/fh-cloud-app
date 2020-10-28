import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IftaReturnDetailsComponent } from './ifta-return-details.component';

describe('IftaReturnDetailsComponent', () => {
  let component: IftaReturnDetailsComponent;
  let fixture: ComponentFixture<IftaReturnDetailsComponent>;

  beforeEach(async(() => {
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

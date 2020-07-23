import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilitySidebarComponent } from './utility-sidebar.component';

describe('UtilitySidebarComponent', () => {
  let component: UtilitySidebarComponent;
  let fixture: ComponentFixture<UtilitySidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilitySidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilitySidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

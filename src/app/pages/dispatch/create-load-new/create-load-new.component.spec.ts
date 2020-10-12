import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLoadNewComponent } from './create-load-new.component';

describe('CreateLoadNewComponent', () => {
  let component: CreateLoadNewComponent;
  let fixture: ComponentFixture<CreateLoadNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLoadNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLoadNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

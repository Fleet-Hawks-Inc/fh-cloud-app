import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedContactsComponent } from './imported-contacts.component';

describe('ImportedContactsComponent', () => {
  let component: ImportedContactsComponent;
  let fixture: ComponentFixture<ImportedContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportedContactsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportedContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesFoldersComponent } from './notes-folders.component';

describe('NotesFoldersComponent', () => {
  let component: NotesFoldersComponent;
  let fixture: ComponentFixture<NotesFoldersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotesFoldersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesFoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

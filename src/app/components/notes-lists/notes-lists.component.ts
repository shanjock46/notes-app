import {Component, Input, OnInit} from '@angular/core';
import {NotesService} from '../../services/notes.service';
import {Folder} from '../../interfaces/folder';

@Component({
  selector: 'app-notes-lists',
  templateUrl: './notes-lists.component.html',
  styleUrls: ['./notes-lists.component.css']
})
export class NotesListsComponent implements OnInit {
  // @Output('defaultLayout')
  public folderId: string;
  public folderLists: Folder[];
  public notesList: any[] = [];
  public defaultLayout: boolean;

  @Input() notes: any;
  @Input() editNote: any;

  constructor(private notesService: NotesService) {
    this.notes = this.notesService.notes;
  }

  ngOnInit(): void {
    this.notesService.getSelectedNote().subscribe(data => {
      this.notes = data.notesList;
      this.editNote = data.notesList[data.activeNote];
    });
    this.notesService.getToggleLayouts().subscribe(data => {
      this.defaultLayout = data.toggleLayouts;
    });
  }


  deleteNote(): void {
    this.notesService.deleteNote(this.notesService.activeNoteId).subscribe(async (data) => {
      console.log(data);
      this.notes.splice(this.notesService.activeNote, 1);
      this.notesService.notes = this.notes;
      this.notes[0].selected = true;
      this.notesService.updateNote(this.notes[0]).subscribe(
        async updatedNoteData => {
          this.notes[0] = updatedNoteData;
          this.notesService.notes = this.notes;
          const sortedNotes = await this.notesService.sortNotesDesc();
          console.log(sortedNotes);
          this.notes = JSON.parse(JSON.stringify(sortedNotes.notesList));
          this.notesService.sendSelectedNote(this.notesService.activeFolder, this.notesService.activeNote, this.notes);
        },
        error => {
          console.log('Error', error);
        });
    }, error => {
      console.log('Error', error);
    });
  }

  addNewNote(): void {
    if (this.notes.length > 0) {
      this.notes[this.notesService.activeNote].selected = false;
      this.notesService.updateNote(this.notes[this.notesService.activeNote]).subscribe((updatedNote) => {
        this.notes[this.notesService.activeNote] = updatedNote;
        this.notesService.notes = this.notes;
        this.notesService.saveNote({
          folderId: this.notesService.activeFolderId,
          content: 'New note',
          selected: true,
          updated: new Date().getTime()
        }).subscribe(
          async newNoteData => {
            this.notes.push(newNoteData);
            this.notesService.notes = this.notes;
            const sortedNotes = await this.notesService.sortNotesDesc();
            console.log(sortedNotes);
            this.notes = JSON.parse(JSON.stringify(sortedNotes.notesList));
            this.notesService.sendSelectedNote(this.notesService.activeFolder, 0, this.notes);
          },
          error => {
            console.log('Error', error);
          });
      }, error => {
        console.log('Error', error);
      });
    }
  }

  selectNote($event: MouseEvent, id: any, notesList: HTMLUListElement): void {
    if (this.notes.length > 0) {
      this.notes[this.notesService.activeNote].selected = false;
      this.notes[this.notesService.activeNote].content = this.editNote.content;
      this.notes[this.notesService.activeNote].updated = new Date().getTime();
      this.notesService.updateNote(this.notes[this.notesService.activeNote]).subscribe((updatedNote) => {
        this.notes[this.notesService.activeNote] = updatedNote;
        this.notesService.notes = this.notes;
        for (let i = 0; i < this.notes.length; i++) {
          if (this.notes[i].id === id) {
            this.notes[i].selected = true;
            this.notesService.activeNote = i;
            this.notesService.activeNoteId = this.notes[i].id;
            // this.notes[i].updated = new Date().getTime();
            this.notesService.updateNote(this.notes[this.notesService.activeNote]).subscribe((selectUpdatedNote) => {
              this.notes[this.notesService.activeNote] = selectUpdatedNote;
              this.notesService.notes = this.notes;
              this.notesService.sendSelectedNote(this.notesService.activeFolder, this.notesService.activeNote, this.notes);
            }, error => {
              console.log('Error', error);
            });
            break;
          }
        }
      }, error => {
        console.log('Error', error);
      });
    }
  }

  toggleLayout(): void {
    this.defaultLayout = !this.defaultLayout;
    this.notesService.sendToggleLayouts(this.defaultLayout);
  }
}

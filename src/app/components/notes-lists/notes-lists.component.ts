import {Component, Input, OnInit, Output} from '@angular/core';
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
    /*this.notesService.get_all_notes().subscribe((notesData) => {
      this.notes = this.notesService.notes = notesData;
    }, (error) => {
      console.log('Error retrieving Notes list from Json-server', error);
    });*/
    this.notes = this.notesService.notes;
  }

  ngOnInit(): void {
    /*this.notesService.getSelectedFolder().subscribe(data => {
      // console.log('in editor');
      // console.log(data);
      this.folderId = data.folder_id;
      this.notes = data.notesList;
      // this.notesList = data.folderList[this.folderId]?.notes || [];
      // console.log(this.notesList);
    });*/

    this.notesService.getSelectedNote().subscribe(data => {
      // console.log('in editor');
      // console.log(data);
      this.notes = data.notesList;
      this.editNote = data.notesList[data.activeNote];
      // this.notesList = data.folderList[this.folderId]?.notes || [];
      // console.log(this.notesList);
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
          this.notes  = JSON.parse(JSON.stringify(sortedNotes.notesList));
          this.notesService.sendSelectedNote(this.notesService.activeFolder, this.notesService.activeNote, this.notes);
        },
        error => {
          console.log('Error', error);
        });
    }, error => {
      console.log('Error', error);
    });

    /*for (let i = 0; i < this.folderLists[this.folderId].notes.length; i++) {
      if (this.folderLists[this.folderId].notes[i].note_id.toString() === id.toString()) {
        this.folderLists[this.folderId].notes.splice(i, 1);
      }
    }
    if (this.folderLists[this.folderId].notes.length > 0) {
      if (this.notesService.activeNote.toString() === id.toString()) {
        this.folderLists[this.folderId].notes[0].selected = true;
        this.notesService.activeNote = Number(this.folderLists[this.folderId].notes[0].note_id);
      }
    }*/
    // this.notesList = this.folderLists[this.folderId]?.notes;
    /*this.sortDesc();
    this.notesService.sendSelectedNote(this.folderId, 0, this.notes);*/
  }

  addNewNote(): void {
    // tslint:disable-next-line:prefer-for-of
    /*for (let i = 0; i < this.notes.length; i++) {
      this.notes[i].selected = false;
    }*/
    if(this.notes.length > 0) {
      this.notes[this.notesService.activeNote].selected = false;
      this.notesService.updateNote(this.notes[this.notesService.activeNote]).subscribe((updatedNote) => {
        this.notes[this.notesService.activeNote] = updatedNote;
        this.notesService.notes = this.notes;
        this.notesService.saveNote({folderId: this.notesService.activeFolderId, content: 'New note', selected: true, updated: new Date().getTime() }).subscribe(
          async newNoteData => {
            this.notes.push(newNoteData);
            this.notesService.notes = this.notes;
            const sortedNotes = await this.notesService.sortNotesDesc();
            console.log(sortedNotes);
            this.notes  = JSON.parse(JSON.stringify(sortedNotes.notesList));
            this.notesService.sendSelectedNote(this.notesService.activeFolder, 0, this.notes);
          },
          error => {
            console.log('Error', error);
          });
      }, error => {
        console.log('Error', error);
      });
    }
    // const listId = this.notesList.length + 1;
  }

  selectNote($event: MouseEvent, id: any, notesList: HTMLUListElement): void {
    // tslint:disable-next-line:prefer-for-of
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

  /*sortDesc(): void {
    this.notesService.activeNote = 0;
    if (this.notes.length > 1) {
      const sortDesc = this.notes.sort((a, b) =>
        b.updated - a.updated
      );
      // console.log(sortDesc);
    }
  }

  sortAsc(): void {
    if (this.notes.length > 1) {
      const sortAsc = this.notes.sort((a, b) => a.updated - b.updated);
      console.log(sortAsc);
    }
  }*/

  toggleLayout(): void {
    this.defaultLayout = !this.defaultLayout;
    this.notesService.sendToggleLayouts(this.defaultLayout);
  }
}

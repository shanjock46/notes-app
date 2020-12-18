import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Folder} from '../../interfaces/folder';
import {NotesService} from '../../services/notes.service';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-notes-editor',
  templateUrl: './notes-editor.component.html',
  styleUrls: ['./notes-editor.component.css']
})
export class NotesEditorComponent implements OnInit {
  @ViewChild('notesTextArea') notesTextArea: ElementRef;

  public folderId: string;
  public noteId: string;
  public folderLists: Folder[];
  public note: any;
  subscription: Subscription;
  public defaultLayout = true;

  @Input() notes: any;
  @Input() editNote: any;

  constructor(private notesService: NotesService) {
  }

  ngOnInit(): void {
    this.notesService.getSelectedNote().subscribe(data => {
      // console.log('in editor');
      // console.log(data);
      // this.folderId = data.folder_id;
      // this.noteId = data.note_id;
      // this.folderLists = data.folderList;
      this.notes = data.notesList;
      this.editNote = data.notesList[data.activeNote];
      // console.log(this.note);
    });

    this.notesService.getToggleLayouts().subscribe(data => {
      this.defaultLayout = data.toggleLayouts;
    });

    const source = interval(30000);
    // console.log(this.notesTextArea);
    this.subscription = source.subscribe(data => this.updateNote());
  }


  updateNote(): void {
    let updateFlag = false;
    if (this.notes[this.notesService.activeNote].content.length !== this.editNote.content.length){
      if (this.notes[this.notesService.activeNote].content.length > this.editNote.content.length
        && ((this.notes[this.notesService.activeNote].content.length - this.editNote.content.length) > 5)){
        updateFlag = true;
      }else {
        if ((this.editNote.content.length - this.notes[this.notesService.activeNote].content.length) > 5){
          updateFlag = true;
        }
      }
    }
    if (updateFlag) {
      this.notes[this.notesService.activeNote].content = this.editNote.content;
      this.notes[this.notesService.activeNote].selected = true;
      this.notes[this.notesService.activeNote].updated = new Date().getTime();
      this.notesService.updateNote(this.notes[this.notesService.activeNote]).subscribe(
        async updatedNoteData => {
          this.notes[this.notes[this.notesService.activeNote]] = updatedNoteData;
          this.notesService.notes = this.notes;
          this.editNote = updatedNoteData;
          const sortedNotes = await this.notesService.sortNotesDesc();
          console.log(sortedNotes);
          this.notes = JSON.parse(JSON.stringify(sortedNotes.notesList));
          this.notesService.sendSelectedNote(this.notesService.activeFolder, this.notesService.activeNote, this.notes);
        },
        error => {
          console.log('Error', error);
        });
    }else{
      console.log('nothing to update for now');
    }
    /*if (typeof this.folderLists[this.folderId].notes[this.noteId] !== 'undefined') {
      this.folderLists[this.folderId].notes[this.noteId].updated = new Date().getTime();
    }
    this.sortDesc();
    this.notesService.sendSelectedFolder(this.folderId, this.folderLists);
    this.notesService.sendSelectedNote(this.folderId, 0, this.folderLists);*/
  }

  sortDesc(): void {
    this.notesService.activeNote = 0;
    if (this.folderLists[this.folderId].notes.length > 1) {
      const sortDesc = this.folderLists[this.folderId].notes.sort((a, b) => b.updated - a.updated);
      // console.log(sortDesc);
    }
  }
}

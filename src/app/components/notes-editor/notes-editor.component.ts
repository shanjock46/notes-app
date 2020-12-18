import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NotesService} from '../../services/notes.service';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-notes-editor',
  templateUrl: './notes-editor.component.html',
  styleUrls: ['./notes-editor.component.css']
})
export class NotesEditorComponent implements OnInit {
  @ViewChild('notesTextArea') notesTextArea: ElementRef;

  subscription: Subscription;
  public defaultLayout = true;

  @Input() notes: any;
  @Input() editNote: any;

  constructor(private notesService: NotesService) {
  }

  ngOnInit(): void {
    this.notesService.getSelectedNote().subscribe(data => {
      this.notes = data.notesList;
      this.editNote = data.notesList[data.activeNote];
    });

    this.notesService.getToggleLayouts().subscribe(data => {
      this.defaultLayout = data.toggleLayouts;
    });

    const source = interval(30000);
    this.subscription = source.subscribe(data => this.updateNote(true));
  }


  updateNote(fromTimeInterval): void {
    let updateFlag = false;
    if (!fromTimeInterval) {
      if (this.notes[this.notesService.activeNote].content.length !== this.editNote.content.length) {
        if (this.notes[this.notesService.activeNote].content.length > this.editNote.content.length
          && ((this.notes[this.notesService.activeNote].content.length - this.editNote.content.length) > 5)) {
          updateFlag = true;
        } else {
          if ((this.editNote.content.length - this.notes[this.notesService.activeNote].content.length) > 5) {
            updateFlag = true;
          }
        }
      }
    } else {
      updateFlag = true;
    }
    if (updateFlag && typeof this.editNote !== 'undefined') {
      this.notes[this.notesService.activeNote].content = this.editNote.content;
      this.notes[this.notesService.activeNote].selected = true;
      this.notes[this.notesService.activeNote].updated = new Date().getTime();
      this.notesService.updateNote(this.notes[this.notesService.activeNote]).subscribe(
        async updatedNoteData => {
          this.notes[this.notes[this.notesService.activeNote]] = updatedNoteData;
          this.notesService.notes = this.notes;
          this.editNote = updatedNoteData;
          const sortedNotes = await this.notesService.sortNotesDesc();
          // console.log(sortedNotes);
          this.notes = JSON.parse(JSON.stringify(sortedNotes.notesList));
          this.notesService.sendSelectedNote(this.notesService.activeFolder, this.notesService.activeNote, this.notes);
        },
        error => {
          console.log('Error', error);
        });
    } else {
      console.log('nothing to update for now');
    }
  }
}

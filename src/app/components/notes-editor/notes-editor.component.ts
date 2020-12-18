import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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

  constructor(private notesService: NotesService) {
  }

  ngOnInit(): void {
    this.notesService.getSelectedNote().subscribe(data => {
      // console.log('in editor');
      // console.log(data);
      this.folderId = data.folder_id;
      this.noteId = data.note_id;
      this.folderLists = data.folderList;
      this.note = data.folderList[this.folderId]?.notes[this.noteId] || {};
      // console.log(this.note);
    });

    this.notesService.getToggleLayouts().subscribe(data => {
      this.defaultLayout = data.toggleLayouts;
    });

    const source = interval(10000);
    // console.log(this.notesTextArea);
    this.subscription = source.subscribe(data => this.saveNote());
  }


  saveNote(): void {
    if (typeof this.folderLists[this.folderId].notes[this.noteId] !== 'undefined') {
      this.folderLists[this.folderId].notes[this.noteId].updated = new Date().getTime();
    }
    this.sortDesc();
    this.notesService.sendSelectedFolder(this.folderId, this.folderLists);
    this.notesService.sendSelectedNote(this.folderId, 0, this.folderLists);
  }

  sortDesc(): void {
    this.notesService.activeNote = 0;
    if (this.folderLists[this.folderId].notes.length > 1) {
      const sortDesc = this.folderLists[this.folderId].notes.sort((a, b) => b.updated - a.updated);
      // console.log(sortDesc);
    }
  }
}

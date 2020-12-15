import {Component, OnInit} from '@angular/core';
import {NotesService} from '../../services/notes.service';
import {Folder} from '../../interfaces/folder';

@Component({
  selector: 'app-notes-lists',
  templateUrl: './notes-lists.component.html',
  styleUrls: ['./notes-lists.component.css']
})
export class NotesListsComponent implements OnInit {
  public folderId: string;
  public folderLists: Folder[];
  public notesList: any[] = [];

  constructor(private notesService: NotesService) {
  }

  ngOnInit(): void {
    this.notesService.getSelectedFolder().subscribe(data => {
      // console.log(data);
      this.folderId = data.folder_id;
      this.folderLists = data.folderList;
      this.notesList = data.folderList[this.folderId]?.notes || [];
      // console.log(this.notesList);
    });
  }


  deleteNote($event: MouseEvent, id: any): void {
    for (let i = 0; i < this.folderLists[this.folderId].notes.length; i++) {
      if (this.folderLists[this.folderId].notes[i].note_id.toString() === id.toString()) {
        this.folderLists[this.folderId].notes.splice(i, 1);
      }
    }
    if (this.folderLists[this.folderId].notes.length > 0) {
      if (this.notesService.activeNote.toString() === id.toString()) {
        this.folderLists[this.folderId].notes[0].selected = true;
        this.notesService.activeNote = Number(this.folderLists[this.folderId].notes[0].note_id);
      }
    }
    this.notesList = this.folderLists[this.folderId]?.notes;
    // console.log(this.notesList);
    this.notesService.sendSelectedNote(0, 0, this.folderLists);
  }

  addNewNote(): void {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.folderLists[this.folderId].notes.length; i++) {
      this.folderLists[this.folderId].notes[i].selected = false;
    }
    const listId = this.notesList.length + 1;
    this.folderLists[this.folderId].notes.push({note_id: listId.toString(), content: 'new note', selected: true});
    this.notesService.activeNote = Number(listId.toString());
    this.notesList = this.folderLists[this.folderId]?.notes;
    this.notesService.sendSelectedNote(this.folderId, listId - 1, this.folderLists);
  }

  selectNote($event: MouseEvent, id: any, notesList: HTMLUListElement): void {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.folderLists[this.folderId].notes.length; i++) {
      if (this.folderLists[this.folderId].notes[i].note_id.toString() === id.toString()) {
        this.folderLists[this.folderId].notes[i].selected = true;
        this.notesService.activeNote = Number(this.folderLists[this.folderId].notes[i].note_id);
        this.notesService.sendSelectedNote(this.folderId, i, this.folderLists);
      } else {
        this.folderLists[this.folderId].notes[i].selected = false;
      }
    }
  }
}

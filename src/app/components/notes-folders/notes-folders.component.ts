/* tslint:disable:prefer-for-of */
import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NotesService} from '../../services/notes.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-notes-folders',
  templateUrl: './notes-folders.component.html',
  styleUrls: ['./notes-folders.component.css']
})

export class NotesFoldersComponent implements OnInit {
  @Input() folderLists: any;

  public prevNewFolderCount = 0;
  @ViewChild('addNewFolderField') addNewFolderField: ElementRef;
  @ViewChild('updateNewFolderField') updateNewFolderField: ElementRef;
  newFolderName = 'New Folder';

  public folderSelectBehaviour: BehaviorSubject<any>;

  constructor(private notesService: NotesService) {
  }

  ngOnInit(): void {
    this.notesService.sendSelectedFolder(0, this.folderLists);
  }

  keydown($event, id: any = null): void {
    // console.log($event);
    if ($event.key === 'Tab' || $event.key === 'Enter') {
      if (id === null) {
        this.saveFolder($event);
      } else {
        this.updateFolder($event, id);
      }
    }
  }

  saveFolder($event): void {
    let nameVal = $event.currentTarget.value;
    // tslint:disable-next-line:only-arrow-functions
    const nameOccurCount = new Map();
    // console.log(this.folderLists);
    let isPresent = false;
    for (let i = 0; i < this.folderLists.length; i++) {
      if (this.folderLists[i].name === nameVal) {
        isPresent = true;
      }
      if (i === 0) {
        nameOccurCount.set(this.folderLists[i].name, 1);
      } else {
        // @ts-ignore
        if (this.folderLists[i].name in nameOccurCount) {
          nameOccurCount.set(this.folderLists[i].name, nameOccurCount.get(this.folderLists[i].name) + 1);
        } else {
          nameOccurCount.set(this.folderLists[i].name, 1);
        }
      }
    }

    if (nameVal === 'New Folder') {
      this.prevNewFolderCount += 1;
    }

    if (nameVal === 'New Folder' && this.prevNewFolderCount !== 1) {
      nameVal = nameVal + ' ' + this.prevNewFolderCount;
    }
    // @ts-ignore
    // tslint:disable-next-line:radix
    const listId = parseInt(this.findLastInsertedFolderId()) + 1;
    this.folderLists.push({id: listId.toString(), name: nameVal, selected: false, notes: []});
    this.addNewFolderField.nativeElement.classList.add('invisible');
    $event.currentTarget.value = this.newFolderName;
    this.sortAsc();
  }

  addNewFolder(): void {
    this.addNewFolderField.nativeElement.classList.remove('invisible');
    this.addNewFolderField.nativeElement.focus();
    // console.log('Add new folder clicked');
  }

  selectFolder($event, id: any, folderList: HTMLUListElement): void {
    for (let i = 0; i < this.folderLists.length; i++) {
      if (this.folderLists[i].id.toString() === id.toString()) {
        this.folderLists[i].selected = true;
        this.notesService.activeFolderId = Number(this.folderLists[i].id);
        this.notesService.activeFolder = i;
        // this.folderSelectEvent.emit({folder_id : i, folderList : this.folderLists});
        // console.log(this.folderLists);
        this.notesService.sendSelectedFolder(i, this.folderLists);
        this.notesService.sendSelectedNote(i, 0, this.folderLists);
      } else {
        this.folderLists[i].selected = false;
      }
    }
  }

  editFolder($event: any, id: any, folderList: HTMLInputElement): void {
    if (id.toString() !== '1') {
      $event.currentTarget.parentElement.parentElement.parentElement.previousElementSibling.children[0].classList.add('d-none');
      $event.currentTarget.parentElement.parentElement.parentElement.previousElementSibling.children[1].classList.remove('d-none');
    }
  }

  deleteFolder($event: any, id: any, folderList: HTMLUListElement): void {
    if (id.toString() !== '1') {
      for (let i = 0; i < this.folderLists.length; i++) {
        if (this.folderLists[i].id.toString() === id.toString()) {
          this.folderLists.splice(i, 1);
        }
      }
      if (this.notesService.activeFolderId.toString() === id.toString()) {
        this.folderLists[0].selected = true;
        this.notesService.activeFolderId = Number(this.folderLists[0].id);
        this.notesService.activeFolder = 0;
      }
    }
    this.notesService.sendSelectedFolder(0, this.folderLists);
    this.notesService.sendSelectedNote(0, 0, this.folderLists);
  }

  updateFolder($event: any, id: any): void {
    if (id.toString() !== '1') {
      for (let i = 0; i < this.folderLists.length; i++) {
        if (this.folderLists[i].id.toString() === id.toString()) {
          this.folderLists[i].name = $event.currentTarget.value;
          $event.currentTarget.classList.add('d-none');
          $event.currentTarget.previousSibling.classList.remove('d-none');
        }
      }
    }
  }

  sortDesc(): void {
    if (this.folderLists.length > 1) {
      const sortDesc = this.folderLists.sort((a, b) => b.name.localeCompare(a.name));
      // console.log(sortDesc);
      for (let i = 0; i < this.folderLists.length; i++) {
        if (this.folderLists[i].id.toString() === this.notesService.activeFolderId.toString()) {
          this.notesService.activeFolder = i;
          break;
        }
      }
      this.notesService.sendSelectedFolder(this.notesService.activeFolder, this.folderLists);
      this.notesService.sendSelectedNote(this.notesService.activeFolder, 0, this.folderLists);
    }
  }

  sortAsc(): void {
    if (this.folderLists.length > 1) {
      const sortAsc = this.folderLists.sort((a, b) => a.name.localeCompare(b.name));
      // console.log(sortAsc);
      for (let i = 0; i < this.folderLists.length; i++) {
        if (this.folderLists[i].id.toString() === this.notesService.activeFolderId.toString()) {
          this.notesService.activeFolder = i;
          break;
        }
      }
      this.notesService.sendSelectedFolder(this.notesService.activeFolder, this.folderLists);
      this.notesService.sendSelectedNote(this.notesService.activeFolder, 0, this.folderLists);
    }
  }

  findLastInsertedFolderId(): number {
    let lastId = 0;
    for (let i = 0; i < this.folderLists.length; i++) {
      if (Number(this.folderLists[i].id) > lastId) {
        lastId = this.folderLists[i].id;
      }
    }
    return lastId;
  }
}

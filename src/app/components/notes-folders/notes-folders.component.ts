/* tslint:disable:prefer-for-of */
import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NotesService} from '../../services/notes.service';

@Component({
  selector: 'app-notes-folders',
  templateUrl: './notes-folders.component.html',
  styleUrls: ['./notes-folders.component.css']
})

export class NotesFoldersComponent implements OnInit {
  @Input() folderLists: any;

  @ViewChild('addNewFolderField') addNewFolderField: ElementRef;
  @ViewChild('updateNewFolderField') updateNewFolderField: ElementRef;
  public newFolderName = 'New Folder';
  public prevNewFolderCount = 0;

  /*Json-server datas*/
  @Input() defaultLayout: any;
  @Input() folders: any;
  @Input() allNotes: any;
  @Input() notes: any;

  // public folderSelectBehaviour: BehaviorSubject<any>;

  constructor(private notesService: NotesService) {
    /*this.notesService.get_all_folders().subscribe((foldersData) => {
      this.folders = this.notesService.folders = foldersData;
    }, (error) => {
      console.log('Error retrieving Folders list from Json-server', error);
    });*/
    // this.folders = this.notesService.folders;
    // this.sortAsc();
  }

  ngOnInit(): void {
    // this.notesService.sendSelectedFolder(0, this.folders);
    this.notesService.getSelectedNote().subscribe(data => {
      // console.log('in editor');
      // console.log(data);
      this.notes = data.notesList;
      // this.notesList = data.folderList[this.folderId]?.notes || [];
      // console.log(this.notesList);
    });
    this.notesService.sendToggleLayouts(this.defaultLayout);
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
    const nameVal = $event.currentTarget.value;
    // tslint:disable-next-line:only-arrow-functions
    const nameOccurCount = new Map();
    // console.log(this.folderLists);
    // tslint:disable-next-line:no-shadowed-variable
    let count = 1;
    for (let i = 0; i < this.folders.length; i++) {
      if (this.folders[i].name.indexOf('New Folder') !== -1) {
        count++;
      }
    }

    this.notesService.saveFolder({name: nameVal + ' ' + count, selected: false}).subscribe(
      async newFolderData => {
        this.folders.push(newFolderData);
        this.notesService.folders = this.folders;
        this.addNewFolderField.nativeElement.classList.add('invisible');
        $event.currentTarget.value = this.newFolderName;
        const sortedFolders = await this.notesService.sortFoldersAsc();
        this.folders = JSON.parse(JSON.stringify(sortedFolders.foldersList));
        this.notesService.sendSelectedFolder(this.notesService.activeFolder, this.folders);
      },
      error => {
        console.log('Error', error);
      }
    );

    // @ts-ignore
    // tslint:disable-next-line:radix
    // const listId = parseInt(this.findLastInsertedFolderId()) + 1;
    // this.folderLists.push({id: listId.toString(), name: nameVal, selected: false, notes: []});
    // this.sortAsc();
  }

  addNewFolder(): void {
    this.addNewFolderField.nativeElement.classList.remove('invisible');
    this.addNewFolderField.nativeElement.focus();
    // console.log('Add new folder clicked');
  }

  selectFolder($event, id: any, folderList: HTMLUListElement): void {
    this.notes = this.notesService.notes = this.allNotes[id];
    this.folders[this.notesService.activeFolder].selected = false;
    this.notesService.updateFolder(this.folders[this.notesService.activeFolder]).subscribe(
      async updatedFolderData => {
        this.folders[this.notesService.activeFolder] = updatedFolderData;
        // this.folders.push(newFolderData);
        this.notesService.folders = this.folders;
        // this.notesService.folders = JSON.parse(JSON.stringify(this.folders));
        for (let i = 0; i < this.folders.length; i++) {
          if (this.folders[i].id === id) {
            this.folders[i].selected = true;
            this.notesService.activeFolderId = this.folders[i].id;
            this.notesService.activeFolder = i;
            this.notesService.updateFolder(this.folders[this.notesService.activeFolder]).subscribe(
              async selectedUpdatedFolderData => {
                this.folders[this.notesService.activeFolder] = selectedUpdatedFolderData;
                // this.folders.push(newFolderData);
                this.notesService.folders = this.folders;
                // this.notesService.folders = JSON.parse(JSON.stringify(this.folders));
                this.notesService.get_active_folder_notes(id).subscribe( async (notesData) => {
                  this.notes = this.notesService.notes = notesData;
                  const sortedNotes = await this.notesService.sortNotesDesc();
                  console.log(sortedNotes);
                  this.notes  = JSON.parse(JSON.stringify(sortedNotes.notesList));
                  this.notesService.sendSelectedFolder(this.notesService.activeFolder, this.folders);
                  this.notesService.sendSelectedNote(this.notesService.activeFolder, 0, this.notes);
                  console.log(this.notes);
                }, (error) => {
                  console.log('Error retrieving specific folder Notes list from Json-server', error);
                });

                this.notesService.get_all_notes().subscribe((allNotes) => {
                  this.allNotes = this.notesService.allNotes = allNotes;
                  const groupedAllNotes = this.allNotes.reduce( (r, a) => {
                    r[a.folderId] = r[a.folderId] || [];
                    r[a.folderId].push(a);
                    return r;
                  }, Object.create(null));
                  console.log(groupedAllNotes);
                  this.notesService.allNotes = this.allNotes = JSON.parse(JSON.stringify(groupedAllNotes));
                  console.log(this.allNotes);
                  console.log(this.notesService.allNotes);
                }, (error) => {
                  console.log('Error retrieving All notes list from Json-server', error);
                });
              }, error => {
                console.log('Error', error);
              }
            );

            break;
          }
        }
      }, error => {
        console.log('Error', error);
      }
    );
  }

  editFolder($event: any, id: any, updateNewFolderField: HTMLInputElement): void {
    $event.currentTarget.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[0].classList.add('d-none');
    $event.currentTarget.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[1].classList.remove('d-none');
  }

  deleteFolder($event: any, id: any, folderList: HTMLUListElement): void {
    this.notesService.deleteFolder(id).subscribe((data) => {
      console.log(data);
      for (let i = 0; i < this.folders.length; i++) {
        if (this.folders[i].id === id) {
          this.folders.splice(i, 1);
          break;
        }
      }
      if (this.notesService.activeFolderId === id) {
        this.folders[0].selected = true;
        this.notesService.activeFolderId = this.folderLists[0].id;
        this.notesService.activeFolder = 0;
      }
      this.notesService.sendSelectedFolder(this.notesService.activeFolder, this.folders);
      this.notesService.sendSelectedNote(this.notesService.activeFolder, 0, this.notes);
    }, error => {
      console.log('Error', error);
    });
  }

  updateFolder($event: any, id: any): void {
    for (let i = 0; i < this.folders.length; i++) {
      if (this.folders[i].id === id) {
        this.folders[i].name = $event.currentTarget.value;
        this.notesService.updateFolder(this.folders[i]).subscribe(
          async updatedFolderData => {
            this.folders[i] = updatedFolderData;
            // this.folders.push(newFolderData);
            this.notesService.folders = this.folders;
            // this.notesService.folders = JSON.parse(JSON.stringify(this.folders));
            $event.currentTarget.classList.add('d-none');
            $event.currentTarget.previousSibling.classList.remove('d-none');
            const sortedFolders = await this.notesService.sortFoldersAsc();
            this.folders = this.notesService.folders = JSON.parse(JSON.stringify(sortedFolders.foldersList));
            this.notesService.sendSelectedFolder(this.notesService.activeFolder, this.folders);
          }, error => {
            console.log('Error', error);
          }
        );
        break;
      }
    }
  }

  /*sortDesc(): void {
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
  }*/

  /*sortAsc(): void {
    /!*if (this.folderLists.length > 1) {
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
    }*!/
    // this.notesService.sortFoldersAsc();
  }*/

  /*findLastInsertedFolderId(): number {
    let lastId = 0;
    for (let i = 0; i < this.folderLists.length; i++) {
      if (Number(this.folderLists[i].id) > lastId) {
        lastId = this.folderLists[i].id;
      }
    }
    return lastId;
  }*/
}

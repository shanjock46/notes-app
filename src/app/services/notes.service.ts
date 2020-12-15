import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  public folderLists: any[];
  public activeFolder = 1;
  public activeFolderId = 1;
  public activeNote = 1;
  public selectFolderSubscriber: BehaviorSubject<any>;
  public selectNoteSubscriber: BehaviorSubject<any>;

  constructor() {
    this.folderLists = Object.assign([], [{
      id: '1', name: 'Notes', selected: true, notes: [
        {
          note_id: '1',
          selected: true,
          content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
          updated: new Date().getTime()
        }
      ]
    }]);
    this.selectFolderSubscriber = new BehaviorSubject<any>({folder_id: 0, folderList: this.folderLists});
    this.selectNoteSubscriber = new BehaviorSubject<any>({folder_id: 0, note_id: 0, folderList: this.folderLists});
  }

  sendSelectedFolder(id: any, folderLists: any): void {
    this.selectFolderSubscriber.next({folder_id: id, folderList: folderLists});
  }

  getSelectedFolder(): Observable<any> {
    return this.selectFolderSubscriber.asObservable();
  }

  sendSelectedNote(folderId: any, id: any, folderLists: any): void {
    this.selectNoteSubscriber.next({folder_id: folderId, note_id: id, folderList: folderLists});
  }

  getSelectedNote(): Observable<any> {
    return this.selectNoteSubscriber.asObservable();
  }

}

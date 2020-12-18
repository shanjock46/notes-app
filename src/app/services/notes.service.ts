import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  public folderLists: any[];
  public activeFolder: number;
  public activeFolderId: string;
  public activeNote: number;
  public activeNoteId: string;
  public defaultLayout: boolean;
  public selectFolderSubscriber: BehaviorSubject<any>;
  public selectNoteSubscriber: BehaviorSubject<any>;
  public toggleLayoutsSubscriber: BehaviorSubject<any>;
  public url: any;

  public folders: any[];
  public allNotes: any[];
  public notes: any[];
  public editNote: any;

  constructor(private http: HttpClient) {
    this.url = 'https://notes-app-json-mock.herokuapp.com';
    this.folderLists = Object.assign([], [{
      id: '1', name: 'Notes', selected: true, notes: [
        {
          activeNote: '1',
          selected: true,
          content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
          updated: new Date().getTime()
        }
      ]
    }]);
    this.defaultLayout = true;
    this.folders = [];
    this.allNotes = [];
    this.notes = [];
    this.editNote = {};
    this.selectFolderSubscriber = new BehaviorSubject<any>({activeFolder: 0, foldersList: this.folders});
    this.selectNoteSubscriber = new BehaviorSubject<any>({activeFolder: 0, activeNote: 0, notesList: this.folders});
    this.toggleLayoutsSubscriber = new BehaviorSubject<any>({toggleLayouts: true});
  }

  sendSelectedFolder(activeFolderLi: any, folders: any): void {
    this.selectFolderSubscriber.next({activeFolder: activeFolderLi, foldersList: folders});
  }

  getSelectedFolder(): Observable<any> {
    return this.selectFolderSubscriber.asObservable();
  }

  sendSelectedNote(activeFolderLi: any, activeNoteLi: any, notes: any): void {
    this.selectNoteSubscriber.next({activeFolder: activeFolderLi, activeNote: activeNoteLi, notesList: notes});
  }

  getSelectedNote(): Observable<any> {
    return this.selectNoteSubscriber.asObservable();
  }

  sendToggleLayouts(defaultLayout: any): void {
    // toggleLayoutsBol = toggleLayoutsBol ? false : true;
    this.toggleLayoutsSubscriber.next({toggleLayouts: defaultLayout});
  }

  getToggleLayouts(): Observable<any> {
    return this.toggleLayoutsSubscriber.asObservable();
  }

  get_all_folders(): Observable<any> {
    return this
      .http
      .get(`${this.url}/folders/`);
  }

  get_all_notes(): Observable<any> {
    return this
      .http
      .get(`${this.url}/notes/`);
  }

  get_active_folder_notes(folderId: string): Observable<any> {
    return this
      .http
      .get(`${this.url}/folders/` + folderId + `/notes`);
  }

  sortFoldersAsc(): Promise<any> {
    if (typeof (this.folders) !== 'undefined') {
      this.folders.sort((a, b) => a.name.localeCompare(b.name));
      for (let i = 0; i < this.folders.length; i++) {
        if (this.folders[i].selected) {
          this.activeFolder = i;
          this.activeFolderId = this.folders[i].id;
          break;
        }
      }
      const retVal = { activeFolderLi: this.activeFolder, activeFolderId: this.activeFolderId, foldersList: this.folders };
      return new Promise(resolve => { resolve(retVal); });
      // return retVal.toPromise();
    }
  }

  sortNotesDesc(): Promise<any> {
    if (typeof (this.notes) !== 'undefined') {
      this.notes.sort((a, b) => b.updated - a.updated);
      for (let i = 0; i < this.notes.length; i++) {
        if (i === 0) {
          this.activeNote = i;
          this.activeNoteId = this.notes[i].id;
          if (!this.notes[i].selected) {
            this.notes[i].selected = true;
            this.updateNote(this.notes[i]);
          }
        }else{
          if (this.notes[i].selected){
            this.notes[i].selected = false;
            this.updateNote(this.notes[i]);
          }
        }
      }
      const retVal = { activeNoteLi: this.activeNote, activeNoteId: this.activeNoteId, notesList: this.notes };
      return new Promise(resolve => { resolve(retVal); });
      // return retVal.toPromise();
    }
  }

  /*sortNotesDesc(): Promise<any>{
    if (typeof (this.notes) !== 'undefined') {
      this.notes.sort((a, b) =>
        b.updated - a.updated
      );
      for (let i = 0; i < this.notes.length; i++) {
        if (this.notes[i].selected) {
          this.activeNote = i;
          this.activeNoteId = this.notes[i].id;
          break;
        }
      }
      const retVal = { activeNoteLi: this.activeNote, activeNoteId: this.activeNoteId, notesList: this.notes };
      return new Promise(resolve => { resolve(retVal); });

      // this.sendSelectedNote(this.activeFolder, 0, this.notes);
    }
  }*/

  saveFolder(param: { name: string; selected: boolean }): Observable<any> {
    return this.http.post(`${this.url}/folders/`, param);
  }

  updateFolder(param: { id: string, name: string; selected: boolean }): Observable<any> {
    return this.http.put(`${this.url}/folders/` + param.id, param);
  }

  deleteFolder(id: string): Observable<any> {
    return this.http.delete(`${this.url}/folders/` + id);
  }

  saveNote(param: {folderId: string, content: string, selected: boolean, updated: number }): Observable<any> {
    return this.http.post(`${this.url}/notes/`, param);
  }

  updateNote(param: { id: string, folderId: string, content: string, selected: boolean, updated: number }): Observable<any> {
    return this.http.put(`${this.url}/notes/` + param.id, param);
  }

  deleteNote(id: string): Observable<any> {
    return this.http.delete(`${this.url}/notes/` + id);
  }
}

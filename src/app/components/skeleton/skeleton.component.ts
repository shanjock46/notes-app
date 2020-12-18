import {Component, OnInit} from '@angular/core';
import {NotesService} from '../../services/notes.service';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.css']
})
export class SkeletonComponent implements OnInit {

  public folderLists: any[];
  public defaultLayout: boolean;
  public defaultFolderLayout = 'col-xl-2 col-lg-2 col-md-2 col-sm-6 col-xs-12 p-0 border-right notes-folder';
  public hideFolderLayout = 'p-0 border-right notes-folder d-none';
  public defaultFolderEditorLayout = 'col-xl-8 col-lg-8 col-md-8 col-sm-12 col-xs-12 p-0 notes-editor';
  public changedFolderEditorLayout = 'col-xl-10 col-lg-10 col-md-10 col-sm-12 col-xs-12 p-0 notes-editor';

  /* Json-server datas */
  public folders: any;
  public allNotes: any;
  public notes: any;
  public editNote: any;

  constructor(private notesService: NotesService) {
    this.folders = JSON.parse(JSON.stringify(this.notesService.folders));
    this.allNotes = JSON.parse(JSON.stringify(this.notesService.allNotes));
    this.notes = JSON.parse(JSON.stringify(this.notesService.notes));
    this.defaultLayout = this.notesService.defaultLayout;
    this.get_api_init();
    /*this.notesService.get_all_notes().subscribe((notesData) => {
      this.notes = this.notesService.notes = notesData;
      this.notesService.sortNotesDesc();
    }, (error) => {
      console.log('Error retrieving Notes list from Json-server', error);
    });*/
  }

  ngOnInit(): void {
    // this.folderLists = this.notesService.folderLists;
    this.notesService.getToggleLayouts().subscribe(data => {
      this.defaultLayout = data.toggleLayouts;
    });
  }

  async get_api_init(): Promise<void> {
    this.notesService.get_all_folders().subscribe( async (foldersData) => {
      this.folders = this.notesService.folders = foldersData;
      const sortedFolders = await this.notesService.sortFoldersAsc();
      // this.folders = sortedFolders.folderLists;
      this.folders  = JSON.parse(JSON.stringify(sortedFolders.foldersList));
      this.notesService.sendSelectedFolder(this.notesService.activeFolder, this.folders);
      this.notesService.get_active_folder_notes(sortedFolders.activeFolderId).subscribe( async (notesData) => {
          this.notes = this.notesService.notes = notesData;
          const sortedNotes = await this.notesService.sortNotesDesc();
          console.log(sortedNotes);
          this.notes  = JSON.parse(JSON.stringify(sortedNotes.notesList));
          this.notesService.sendSelectedNote(this.notesService.activeFolder, 0, this.notes);
          console.log(this.notes);
        }, (error) => {
          console.log('Error retrieving specific folder Notes list from Json-server', error);
        });
    }, (error) => {
      console.log('Error retrieving Folders list from Json-server', error);
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
  }

}

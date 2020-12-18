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

  constructor(private notesService: NotesService) {
  }

  ngOnInit(): void {
    this.folderLists = this.notesService.folderLists;
    this.defaultLayout = this.notesService.defaultLayout;
    this.notesService.getToggleLayouts().subscribe(data => {
      this.defaultLayout = data.toggleLayouts;
    });
  }

}

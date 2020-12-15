import {Component, OnInit} from '@angular/core';
import {NotesService} from '../../services/notes.service';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.css']
})
export class SkeletonComponent implements OnInit {

  public folderLists: any[];

  constructor(private noteService: NotesService) {
  }

  ngOnInit(): void {
    this.folderLists = this.noteService.folderLists;
  }

}

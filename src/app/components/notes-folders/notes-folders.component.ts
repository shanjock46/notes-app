/* tslint:disable:prefer-for-of */
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-notes-folders',
  templateUrl: './notes-folders.component.html',
  styleUrls: ['./notes-folders.component.css']
})

export class NotesFoldersComponent implements OnInit {

  constructor() {

  }

  public activeFolder = 1;
  public prevNewFolderCount = 0;
  // addNewFolderField = true ;
  @ViewChild('addNewFolderField') addNewFolderField: ElementRef;
  newFolderName = 'New Folder';

  public folderLists: Array<any> = [
    {id: 1, name: 'Notes', count: 1, selected: true}
  ];

  ngOnInit(): void {
  }

  /*onBlur($event): void {
    // console.log($event);
    this.saveFolder($event);
  }*/

  keydown($event, id: any = null): void {
    console.log($event);
    if ($event.key === 'Tab' || $event.key === 'Enter') {
      if (id === null) {
        this.saveFolder($event);
      }else{
        this.updateFolder($event, id);
      }
    }
  }

  saveFolder($event): void {
    let nameVal = $event.currentTarget.value;
    // tslint:disable-next-line:only-arrow-functions
    const nameOccurCount = new Map();
    console.log(this.folderLists);
    let isPresent = false;
    for (let i = 0; i < this.folderLists.length; i++){
      if (this.folderLists[i].name === nameVal){
        isPresent = true;
      }
      if (i === 0){
        nameOccurCount.set(this.folderLists[i].name, 1);
      }else{
        if (this.folderLists[i].name in nameOccurCount ){
          nameOccurCount.set(this.folderLists[i].name, nameOccurCount.get(this.folderLists[i].name) + 1);
        }else{
          nameOccurCount.set(this.folderLists[i].name, 1);
        }
      }
    }

    console.log(nameOccurCount);
    /*const isPresent = this.folderLists.some(function(el): boolean {
      console.log(el.name);
      if(el.name in nameOccurCount ){
        nameOccurCount.set(el.name, nameOccurCount.get(el.name) + 1);
      }else{
        nameOccurCount.set(el.name, 1);
      }
      return el.name === nameVal;
    });*/
    if (nameVal === 'New Folder'){
      this.prevNewFolderCount += 1;
    }

    if (nameVal === 'New Folder' && this.prevNewFolderCount !== 1){
      nameVal = nameVal + ' ' + this.prevNewFolderCount;
    }
    // tslint:disable-next-line:radix
    this.folderLists.push({id: parseInt(this.folderLists[this.folderLists.length - 1].id) + 1, name: nameVal, count: 0, selected: false});
    this.addNewFolderField.nativeElement.classList.add('d-none');
    $event.currentTarget.value = this.newFolderName;
  }

  addNewFolder(): void {
    this.addNewFolderField.nativeElement.classList.remove('d-none');
    this.addNewFolderField.nativeElement.focus();
    // this.addNewFolderField.nativeElement.focus();
    console.log('Add new folder clicked');
  }

  selectFolder($event, id: any, folderList: HTMLUListElement): void {
    // @ts-ignore
    // for (let i = 0; i < folderList.childElementCount; i++){
    //   // tslint:disable-next-line:triple-equals
    //   if (folderList.children[i].getAttribute('data-folderId') === id.toString()) {
    //     folderList.children[i].classList.add('active');
    //     folderList.children[i].classList.add('disabledEvents');
    //     folderList.children[i].classList.remove('makeCursor');
    //     this.folderLists[i].selected = true;
    //   }else{
    //     folderList.children[i].classList.remove('active');
    //     folderList.children[i].classList.remove('disabledEvents');
    //     folderList.children[i].classList.add('makeCursor');
    //     this.folderLists[i].selected = false;
    //   }
    // }
    for (let i = 0; i < this.folderLists.length; i++) {
      this.folderLists[i].selected = this.folderLists[i].id.toString() === id.toString();
    }
  }

  editFolder($event: any, id: any, folderList: HTMLInputElement):void {
    if (id.toString() !== '1'){
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
    }
  }

  updateFolder($event: any, id: any) {
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
}

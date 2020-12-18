import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MDBBootstrapModule} from 'angular-bootstrap-md';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {SkeletonComponent} from './components/skeleton/skeleton.component';
import {NotesFoldersComponent} from './components/notes-folders/notes-folders.component';
import {NotesListsComponent} from './components/notes-lists/notes-lists.component';
import {NotesEditorComponent} from './components/notes-editor/notes-editor.component';
import {FormsModule} from '@angular/forms';
import {NotesService} from './services/notes.service';


@NgModule({
  declarations: [
    AppComponent,
    SkeletonComponent,
    NotesFoldersComponent,
    NotesListsComponent,
    NotesEditorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    FormsModule
  ],
  providers: [
    NotesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import { Component, ViewChild } from '@angular/core';
import { FilePondOptions, FilePondFile, FilePondErrorDescription } from 'filepond';
import { getEditorDefaults } from '@pqina/pintura';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FilePondComponent } from 'ngx-filepond';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @ViewChild('myPond') myPond: any;

  pondOptions = {
      class: 'my-filepond',
      multiple: true,
      labelIdle: 'Drop files here',
      acceptedFileTypes: 'image/jpeg, image/png',
  };

  pondFiles = ['index.html'];

  pondHandleInit() {
      console.log('FilePond has initialised', this.myPond);
  }

  pondHandleAddFile(event: any) {
      console.log('A file was added', event);
  }
}

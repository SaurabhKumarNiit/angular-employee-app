import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { EmployeeService } from '../services/employee.service';
import { FilePondComponent } from 'ngx-filepond';
import { FilePondOptions } from 'filepond';

@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss'],
})
export class EmpAddEditComponent implements OnInit {
  empForm: FormGroup;
  urllink: string = "";
  loading: boolean = false; // Flag to indicate whether the image is being loaded
  imageLoaded: boolean = false; // Flag to indicate whether the image has been loaded

  selectFiles(event: any): void {
    if(event.target.files){
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      this.loading = true; // Set loading flag to true during image uploading
      reader.onload = (event: any) => {
        this.urllink = event.target.result;
        // Simulate image uploading delay
        setTimeout(() => {
          this.loading = false; // Set loading flag to false after image is uploaded
          this.imageLoaded = true; // Set imageLoaded flag to true after image rendering
        }, 1200); // Simulated 2 seconds delay
      }
    }
  }

  // This method will be called when the image is loaded
  onImageLoad(): void {
    // Set imageLoaded flag to true after image is loaded
    this.imageLoaded = true;
  }

  removeImage(): void {
    this.urllink = ''; // Clear the URL of the uploaded image
    this.imageLoaded = false; // Reset imageLoaded flag
  }

  education: string[] = [
    'Matric',
    'Diploma',
    'Intermediate',
    'Graduate',
    'Post Graduate',
  ];

  constructor(
    private _fb: FormBuilder,
    private _empService: EmployeeService,
    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService
  ) {
    this.empForm = this._fb.group({
      firstName: ['',Validators.required],
      lastName: ['',Validators.required],
      email: ['',Validators.required],
      dob: ['',Validators.required],
      gender: '',
      education: '',
      company: ['',Validators.required],
      experience: '',
      image:''
    });
  }

  // get firstName() {
  //   return this.empForm.get('firstName');
  // }


  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }

  ngOnInit(): void {
    this.empForm.patchValue(this.data);
  }
  // newEmpForm:any={firstName:'',lastName:'',image:'',email:'',dob:'',gender:'',education:'',company:'',experience:''}
  // submitData() {
  //   const file = this.DataURIToBlob(this.urllink);
  //   const formData = new FormData();
  //  formData.append('image', file, 'image.jpg') 
  //  formData.append('firstName', this.newEmpForm.firstName);
  //  formData.append('email', this.newEmpForm.email);
  //  formData.append('lastName', this.newEmpForm.lastName);
  //  formData.append('dob', this.newEmpForm.dob);
  //  formData.append('gender', this.newEmpForm.gender);
  //  formData.append('education', this.newEmpForm.education);
  //  formData.append('company', this.newEmpForm.company);
  //  formData.append('experience', this.newEmpForm.experience);
  //   console.log('Sending data to the backend:', formData);
  //   this._empService.addEmployee(formData).subscribe(res=>{

  //     console.log(res);
  //   })
  // }

  onSubmit() {
    const file = this.DataURIToBlob(this.urllink);

    const formData = new FormData();
    formData.append('firstName', this.empForm.get('firstName')?.value ?? '');
    formData.append('lastName', this.empForm.get('lastName')?.value ?? '');
    formData.append('email', this.empForm.get('email')?.value ?? '');
    formData.append('dob', this.empForm.get('dob')?.value ?? '');
    formData.append('gender', this.empForm.get('gender')?.value ?? '');
    formData.append('education', this.empForm.get('education')?.value ?? '');
    formData.append('company', this.empForm.get('company')?.value ?? '');
    formData.append('experience', this.empForm.get('experience')?.value ?? '');
    formData.append('image', file, 'image.jpg') 


    console.log(formData);
    this._empService.addEmployee(formData).subscribe(
      () => {
        console.log('Employee data uploaded successfully');
      },
      error => {
        console.error('Error uploading employee data:', error);
      }
    );
  }


  onFormSubmit() {
    const file = this.DataURIToBlob(this.urllink);
    const formData = new FormData();
    formData.append('image', file, 'image.jpg') 

    this.empForm.value.image=formData;
    console.log(this.empForm.value);
    if (this.empForm.valid) {
      if (this.data) {
        this._empService
          .updateEmployee(this.data._id, this.empForm.value)
          .subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar('Employee detail updated!');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      } else {
        this._empService.addEmployee(this.empForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Employee added successfully');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }else{
      this._coreService.openSnackBar('Please Check Required Fields !');
    }
  }
}

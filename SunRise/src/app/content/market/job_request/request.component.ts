import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { AuthenticationService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-request',
  templateUrl: './request.component.html',
  styleUrls: [ './request.component.css' ]
})
export class JobRequestComponent implements OnInit{
  public Editor = ClassicEditor;
  validateForm: FormGroup;

  getUsername(){
    return this.userService.getUsername();
  };

  getIp(){
    return this.userService.getIp();
  }

  submitForm = ($event: any, value: any) => {
    var username = this.getUsername();
    var userProfile = new FormData();
    userProfile.append("username", username);
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      if (key === "rangePickerTime"){
        userProfile.append("startTime", value["rangePickerTime"][0].toString().split('(')[0]);
        userProfile.append("endTime", value["rangePickerTime"][1].toString().split('(')[0]);
      }else{
        userProfile.append(key, value[key]);
      }
      this.validateForm.controls[ key ].markAsDirty();
      this.validateForm.controls[ key ].updateValueAndValidity();
    }

    const headers = new HttpHeaders();
    // const headers = new Headers({ 'Access-Control-Allow-Origin': '*' });
    headers.append('Access-Control-Allow-Origin', '*');
    // const options = new RequestOptions({ headers, withCredentials: true });
    var token = this.userService.getToken();
    var httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };
    this.http.post<any>(this.getIp() + `/jobs/form/`, userProfile, httpOptions).subscribe(
      data => {this.router.navigate(['/home/market']);},
      error => {}
    );
  }



  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[ key ].markAsPristine();
      this.validateForm.controls[ key ].updateValueAndValidity();
    }
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  userNameAsyncValidator = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors | null>) => {
    setTimeout(() => {
      if (control.value === 'JasonWood') {
        observer.next({ error: true, duplicated: true });
      } else {
        observer.next(null);
      }
      observer.complete();
    }, 1000);
  })

  confirmValidator = (control: FormControl): { [ s: string ]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  }

  constructor(private fb: FormBuilder, private http: HttpClient, private userService: AuthenticationService,private router: Router) {

  }


  ngOnInit(): void {
    this.validateForm = this.fb.group({
      jobTitle: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      openFor: [ '', [ Validators.required ] ],
      details: [ '', [ Validators.required ] ],
      rangePickerTime: [ [] ]
    });
  }
}


import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {HttpClient, HttpHeaders, HttpEvent, HttpRequest, HttpEventType, HttpResponse} from '@angular/common/http';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
import {AuthenticationService} from 'src/app/services';
import {NzNotificationService, UploadXHRArgs} from 'ng-zorro-antd';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  @ViewChild('userName') userName: ElementRef;

  ip: string;
  validateForm: FormGroup;
  isJPG = 'image/png,image/jpeg';
  // isPng = 'image/png';
  imgUrl = '/assets/default_user_icon.png';

  getUsername() {
    return this.userService.getUsername();
  };

  getIp() {
    return this.userService.getIp();
  }

  submitForm = ($event: any, value: any) => {


    var username = this.getUsername();
    var userProfile = new FormData();
    userProfile.append('username', username);
    $event.preventDefault();
    for (const key in this.validateForm.controls) {

      userProfile.append(key, value[key]);
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
     
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
    this.http.post<any>(this.getIp() + `/users/profile/`, userProfile, httpOptions).subscribe(
      data => {
        this.notification.blank(
          'Update Successfully',
          'User information has been updated sucessfully.',
          {
            nzStyle: {
              width: '600px',
              marginLeft: '-265px'
            },
            nzClass: 'test-class'
          }
        );
 
      },
      error => {
        
      }
    );
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  userNameAsyncValidator = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors | null>) => {
    setTimeout(() => {
      if (control.value === 'JasonWood') {
        observer.next({error: true, duplicated: true});
      } else {
        observer.next(null);
      }
      observer.complete();
    }, 1000);
  })

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (control.value !== this.validateForm.controls.password.value) {
      return {confirm: true, error: true};
    }
    return {};
  }

  constructor(private fb: FormBuilder, private http: HttpClient, private userService: AuthenticationService, private notification: NzNotificationService) {
  }

  getProfile() {
    var token = this.userService.getToken();
    var httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };
    return this.http.get<any>(this.getIp() + `/users/profile/?username=` + this.getUsername(), httpOptions);
  };

  ngOnInit(): void {
    this.ip = this.getIp();
    this.validateForm = this.fb.group({
      email: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      user_description: ['', [Validators.required]],
    });
    var username = this.userService.getUsername();
    this.userName.nativeElement.innerHTML = username;
    this.getProfile().subscribe(
      data => {
        this.validateForm = this.fb.group({
          email: [data['email'], [Validators.required]],
          phoneNumber: [data['phoneNumber'], [Validators.required]],
          firstName: [data['firstName'], [Validators.required]],
          lastName: [data['lastName'], [Validators.required]],
          address: [data['address'], [Validators.required]],
          user_description: [data['selfIntro'], [Validators.required]],
        });
      },
      error => {
        
      }
    );
   
    this.getImage(this.getUsername());
  }



  
  customReq = (item: UploadXHRArgs) => {
    const headers = new HttpHeaders();
    // const headers = new Headers({ 'Access-Control-Allow-Origin': '*' });
    headers.append('Access-Control-Allow-Origin', '*');
    // headers.append('reportProgress', 'true');
    // const options = new RequestOptions({ headers, withCredentials: true });
    var token = this.userService.getToken();
    var httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };
    const formData = new FormData();
    formData.append('file', item.file as any);
    formData.append('username', this.getUsername());
    const req = new HttpRequest('POST', item.action!, formData, httpOptions);
    
    return this.http.request(req).subscribe(
      (event: HttpEvent<{}>) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total! > 0) {
            // tslint:disable-next-line:no-any
            (event as any).percent = (event.loaded / event.total!) * 100;
          }
          item.onProgress!(event, item.file!);
        } else if (event instanceof HttpResponse) {
          this.getImage(this.getUsername());
          item.onSuccess!(event.body, item.file!, event);
        }
      },
      err => {
        item.onError!(err, item.file!);
      }
    );
  };


  getImage(username){
    const headers = new HttpHeaders();
    // const headers = new Headers({ 'Access-Control-Allow-Origin': '*' });
    headers.append('Access-Control-Allow-Origin', '*');
    // headers.append('reportProgress', 'true');
    // const options = new RequestOptions({ headers, withCredentials: true });
    var token = this.userService.getToken();
    var httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };
    const formData = new FormData();
    formData.append('username', username);
    this.http.post<any>(this.ip + "/account/getIcon/", formData, httpOptions).subscribe(
      data =>{
        
        this.imgUrl = this.ip + "/" + data.imgfile;
      },
      error=>{
        
        this.imgUrl = '/assets/default_user_icon.png';
      }
      
    )
  }
}


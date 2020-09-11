import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Observable, Observer} from 'rxjs';
import {HttpClient, HttpHeaders, HttpRequest, HttpEvent, HttpResponse, HttpEventType} from '@angular/common/http';
import {AuthenticationService} from 'src/app/services';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {FormGroup, FormBuilder, FormArray} from '@angular/forms';
import {MarketComponent} from '../market.component';
import { UploadXHRArgs } from 'ng-zorro-antd';
import { Candidate } from './candidate.model';

@Component({
  selector: 'app-job-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})

export class JobDetailComponent implements OnInit {
  candidate: Candidate[] = [];
  isVisible = false;
  private sub: any;
  public isStudent = false;
  public isCompany = false;
  title: any;
  visible = false;
  validateForm: FormGroup;
  listOfOption: Array<{ label: string; value: string }> = [];
  size = 'default';
  singleValue = 'a10';
  multipleValue = ['a10', 'c12'];
  tagValue = [];
  jobID: number;
  @ViewChild('Job_title') Job_title: ElementRef;
  @ViewChild('Company_name') Company_name: ElementRef;
  @ViewChild('Short_description') Short_description: ElementRef;
  @ViewChild('Job_Number') Job_Number: ElementRef;
  @ViewChild('Main_Job_Description') Main_Job_Description: ElementRef;
  @ViewChild('Apply_start') Apply_start: ElementRef;
  @ViewChild('Apply_end') Apply_end: ElementRef;
  fileList = [];
  pdf = 'pdf';
  ip: string;

  constructor(
    private http: HttpClient,
    private userService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder) {
  }

  showModal(): void {
    this.isVisible = true;
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  getUsername() {
    return this.userService.getUsername();
  }

  getIp() {
    return this.userService.getIp();
  }

  getRole() {
    let role = this.userService.getRole();
    if (role === 'Student') {
      this.isStudent = true;
    } else if (role === 'Company') {
      this.isCompany = true;
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.jobID = +params.id;
      }
    );
    this.ip = this.getIp();
    this.getRole();
    this.getTag();
    this.validateForm = this.fb.group({
      inviteFrom: this.fb.array([this.initInvition()])
    });

    const children: Array<{ label: string; value: string }> = [];
    for (let i = 10; i < 36; i++) {
      children.push({label: i.toString(36) + i, value: i.toString(36) + i});
    }
    this.listOfOption = children;

    this.getJobDetail(this.jobID);
  }

  initInvition() {
    // initialize our address
    return this.fb.group({
      userName: [''],
      description: [''],
      rangePickerTime: [[]]
    });
  }

  addInvition() {
    // add address to the list
    const control = this.validateForm.controls.inviteFrom as FormArray;
    control.push(this.initInvition());
  }

  removeInvition(i: number) {
    // remove address from the list
    const control = this.validateForm.controls.inviteFrom as FormArray;
    control.removeAt(i);
  }


  getJobDetail(jobId) {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    let token = this.userService.getToken();
    let username = this.getUsername();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };
    let jobProfile = new FormData();
    jobProfile.append('jobId', jobId);
    this.http.post<any>(this.getIp() + `/jobs/details/`, jobProfile, httpOptions).subscribe(
      jobs => {
        this.Job_title.nativeElement.innerHTML = jobs.jobTitle;
        this.Short_description.nativeElement.innerHTML = jobs.description;
        this.Company_name.nativeElement.innerHTML = jobs.company;
        this.Job_Number.nativeElement.innerHTML = jobs.openFor;
        this.Main_Job_Description.nativeElement.innerHTML = jobs.details;
        this.Apply_start.nativeElement.innerHTML = jobs.startTime;
        this.Apply_end.nativeElement.innerHTML = jobs.endTime;

      },
      error => {
      }
    );
  }


  submitForm = ($event: any, value: any) => {

    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    let token = this.userService.getToken();
    // let username = this.getUsername();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };
    let companyName = this.getUsername();
    let userProfile = new FormData();
    userProfile.append('companyName', companyName);
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      for (var i = 0; i < value[key].length; i++){
        var user = new Candidate(
          value[key][i].userName,
          value[key][i].description,
          value[key][i].rangePickerTime[0].toString().split('(')[0],
          value[key][i].rangePickerTime[1].toString().split('(')[0],
          )
        userProfile.append("user"+i, JSON.stringify(user));
      }
      // userProfile.append(key, value[key]);
      // this.validateForm.controls[key].markAsDirty();
      // this.validateForm.controls[key].updateValueAndValidity();
      this.http.post<any>(this.getIp() + `/schedule/save-multiple/`, userProfile, httpOptions).subscribe(
        data => {
          this.http.post<any>(this.getIp() + `/mail/send-email/`, userProfile, httpOptions).subscribe(
            res => {
            },
            err =>{
              
            }
          )
        },
        error => {
          
        }
      );
    }
  
    

  }

  get formData() {
    return this.validateForm.get('inviteFrom') as FormArray;
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
    formData.append('jobId', this.jobID.toString());
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
          item.onSuccess!(event.body, item.file!, event);
        }
      },
      err => {
        item.onError!(err, item.file!);
      }
    );
  };



  getTag(){
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
    formData.append("jobId", this.jobID.toString());
    this.http.post<any>(this.getIp() + `/jobs/applicant/`, formData, httpOptions).subscribe(
      data =>{
        this.tagValue = data;
        
      },
      err =>{
       
      }
    );

  }

}

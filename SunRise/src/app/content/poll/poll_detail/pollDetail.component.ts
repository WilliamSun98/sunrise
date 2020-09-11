
import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Observable, Observer } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { AuthenticationService } from 'src/app/services';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
    selector: 'app-poll-detail',
    templateUrl: './pollDetail.component.html',
    styleUrls: [ './pollDetail.component.css' ]
  })

export class PollDetailComponent implements OnInit{
    isVisible = false;
    private sub: any;
    public isStudent = false;
    public isClub = false;
    title: any;
    pollID: number;
    radioValue = 'yes';
    answerForm: FormGroup;
    answers = ['yes', 'no'];

    @ViewChild('Job_title') Job_title: ElementRef;
    @ViewChild('Company_name') Company_name: ElementRef;
    @ViewChild('Short_description') Short_description: ElementRef;
    @ViewChild('Job_Number') Job_Number: ElementRef;
    @ViewChild('Main_Job_Description') Main_Job_Description:ElementRef;
    @ViewChild('Apply_start') Apply_start:ElementRef;
    @ViewChild('Apply_end') Apply_end:ElementRef;


    constructor(     
      private http: HttpClient, 
      private userService: AuthenticationService,
      private router: Router,
      private route: ActivatedRoute,
      private fb: FormBuilder) {}
  
    showModal(): void {
      this.isVisible = true;
    }
  
    handleOk(): void {
      this.isVisible = false;
    }
  
    handleCancel(): void {
      this.isVisible = false;
    }

    
    getUsername(){
      return this.userService.getUsername();
    };

    getRole(){
      var role = this.userService.getRole();
      if (role === "Student"){
          this.isStudent = true;
      }else if (role === "Club"){ 
          this.isClub = true;
      }
    }

    getIp(){
      return this.userService.getIp();
    }

    ngOnInit(): void {
      this.route.params.subscribe(
        (params: Params) => {
          this.pollID = +params['id'];
        }
      );
   
      this.getRole();
      this.getPollDetail(this.pollID);

      this.answerForm = new FormGroup({
        'answer': new FormControl('yes'),
      });
    }

    getPollDetail(pollId){
      const headers = new HttpHeaders();
      headers.append('Access-Control-Allow-Origin', '*');
      var token = this.userService.getToken();
      var username = this.getUsername();
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token
        })
      };
      var pollProfile = new FormData();
      pollProfile.append("pollId", pollId);
      this.http.post<any>(this.getIp() + `/poll/details/`, pollProfile, httpOptions).subscribe(
        polls => {
          this.Job_title.nativeElement.innerHTML = polls.pollTitle;
          this.Short_description.nativeElement.innerHTML = polls.description;
          this.Company_name.nativeElement.innerHTML = polls.clubname;
          this.Main_Job_Description.nativeElement.innerHTML = polls.details;
          this.Apply_start.nativeElement.innerHTML = polls.startTime;
          this.Apply_end.nativeElement.innerHTML = polls.endTime;

  
          },
        error => {}
      )
    }


    onSubmit(){
      console.log(this.answerForm.value);

    }
}

  














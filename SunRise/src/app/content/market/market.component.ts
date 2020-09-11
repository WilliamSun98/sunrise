import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Observable, Observer} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthenticationService} from 'src/app/services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {
  // tslint:disable-next-line:no-any
  public jobList: any[] = [];
  loading = false;
  total: number;
  @ViewChild('request') request: ElementRef;

  constructor(
    private http: HttpClient,
    private userService: AuthenticationService,
    private router: Router) {

  }

  public isCompany = false;

  ngOnInit(): void {
    this.getRole();
    this.getJobs();
  }

  getJobs(page = 1) {
    const headers = new HttpHeaders();
    // const headers = new Headers({ 'Access-Control-Allow-Origin': '*' });
    headers.append('Access-Control-Allow-Origin', '*');
    // const options = new RequestOptions({ headers, withCredentials: true });
    var token = this.userService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };
    var username = this.getUsername();
    var userProfile = new FormData();
    userProfile.append('page', page.toString());
    userProfile.append('username', username);
    this.http.post<any>(this.getIp() + `/jobs/list/`, userProfile, httpOptions).subscribe(
      jobs => {
        this.jobList = jobs;

      },
      
    )
  }

  getTotal(){
    const headers = new HttpHeaders();
    // const headers = new Headers({ 'Access-Control-Allow-Origin': '*' });
    headers.append('Access-Control-Allow-Origin', '*');
    // const options = new RequestOptions({ headers, withCredentials: true });
    var token = this.userService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };
    var username = this.getUsername();
    var userProfile = new FormData();
    userProfile.append('username', username);
    this.http.post<any>(this.getIp() + `/jobs/total/`, userProfile, httpOptions).subscribe(
      num => {
        this.total = num;

      },
      
    )
  }

  getUsername() {
    return this.userService.getUsername();
  };

  getRole() {
    var role = this.userService.getRole();
    if (role === 'Company') {
      this.isCompany = true;
    }
  }

  getIp() {
    return this.userService.getIp();
  }
}

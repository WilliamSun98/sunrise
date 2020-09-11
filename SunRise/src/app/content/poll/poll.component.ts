import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Observable, Observer} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthenticationService} from 'src/app/services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent {

  // tslint:disable-next-line:no-any
  public pollList: any[] = [];
  public isClub = false;
  loading = false;

  @ViewChild('request') request: ElementRef;

  constructor(
    private http: HttpClient,
    private userService: AuthenticationService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.getRole();
    this.getPolls();
  }

  getPolls(page = 1) {
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
    // var username = this.getUsername();
    var userProfile = new FormData();
    userProfile.append('page', page.toString());
    this.http.post<any>(this.getIp() + `/poll/list/`, userProfile, httpOptions).subscribe(
      polls => {
        this.pollList = polls;
      },
      error => {

      }
    )
  }

  getUsername() {
    return this.userService.getUsername();
  };

  getRole() {
    var role = this.userService.getRole();
    if (role === 'Club') {
      this.isClub = true;
    }
  }

  getIp() {
    return this.userService.getIp();
  }
}

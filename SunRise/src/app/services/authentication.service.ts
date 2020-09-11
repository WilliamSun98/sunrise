import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {User} from '../auth/models';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public token: string;
  public token_expires: Date;
  public errors: any = [];
  public username: string;
  public role: string;
  private ip: string = 'https://sunrise.99jhs.com';
  // private ip: string = 'http://127.0.0.1:8000';

  constructor(
    private http: HttpClient,
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  authenticate(username: string, password: string) {
    const headers = new HttpHeaders();
    // const headers = new Headers({ 'Access-Control-Allow-Origin': '*' });
    headers.append('Access-Control-Allow-Origin', '*');
    // const options = new RequestOptions({ headers, withCredentials: true });
    return this.http.post<any>(this.ip + '/api-token-auth/', {username, password}, {headers});
    //   .subscribe(
    //   data => {
    //     console.log('data');
    //     console.log(data['token']);
    //     this.updateData(data['token']);
    //     console.log(this.token);
    //   },
    //   err => {
    //     this.errors = err.error;
    //   }
    // );
  }

  login(username: string, password: string, token: string) {
    this.updateData(token);

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };

    return this.http.post(this.ip + `/users/login/`, {username, password}, httpOptions);
      // .pipe(map(user => {
      //   // login successful if there's a jwt token in the response
      //   if (user && user.token) {
      //     // store user details and jwt token in local storage to keep user logged in between page refreshes
      //     localStorage.setItem('currentUser', JSON.stringify(user));
      //     this.currentUserSubject.next(user);
      //   }
      //
      //   return user;
      // }));
  }

  private updateData(token) {
    this.token = token;
    this.errors = [];

    // decode the token to read the username and expiration timestamp
    const token_parts = this.token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = new Date(token_decoded.exp * 1000);
    this.username = token_decoded.username;
  }

  public getUsername() {
    return this.username;
  }

  public getToken() {
    return this.token;
  }

  public setRole(role: string) {
    this.role = role;
  }

  public getRole() {
    return this.role;
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  register(user: User) {
    return this.http.post(this.ip + `/users/register/`, user);
  }

  isAuthenticated() {
    return this.token != null;
  }

  getIp() {
    return this.ip;
  }
}

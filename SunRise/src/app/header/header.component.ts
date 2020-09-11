import {Component, ViewChild, OnInit, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {AuthenticationService} from '../services';
import {User} from '../auth/models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: User;
  url: string = 'https://openweathermap.org/img/w/01d.png';
  @ViewChild('weather_description') weather_description: ElementRef;
  @ViewChild('weather_min_temperature') weather_min_temperature: ElementRef;
  @ViewChild('weather_max_temperature') weather_max_temperature: ElementRef;
  @ViewChild('weather_image') weather_image: ElementRef;


  ngOnInit() {
    this.http.get<any>('https://api.openweathermap.org/data/2.5/weather?q=Toronto,CA&appid=3addd317ea8451210a72b1bea160648a').subscribe(
      data => {
        this.weather_description.nativeElement.innerHTML = data.weather[0].main;
        const min_tem = (Math.round(data.main.temp_min) - 273) + '°C';
        const max_tem = (Math.round(data.main.temp_max) - 273) + '°C';
        this.weather_min_temperature.nativeElement.innerHTML = min_tem;
        this.weather_max_temperature.nativeElement.innerHTML = max_tem;
        const new_icon_link = 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
        this.url = new_icon_link;

      },
      err => {

      }
    );
  }

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private http: HttpClient
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }
}

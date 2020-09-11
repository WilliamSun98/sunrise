import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sider',
  templateUrl: './sider.component.html',
  styleUrls: [ './sider.component.css' ]
})
export class SiderComponent implements OnInit{
  isCollapsed = false;
  isCompany = false;
  isStudent = false;
  isClub = false;


  constructor(     
    private http: HttpClient, 
    private userService: AuthenticationService,
    ) {}

    getRole(){
      return this.userService.getRole();
    };

    checkRole(){
      if (this.getRole() == "Student"){
        this.isStudent = true;
      }
      else if (this.getRole() == "Company"){
        this.isCompany = true;
      }
      else if (this.getRole() == "Club"){

        this.isClub = true;
      }
    }

  ngOnInit(){
    this.checkRole();
  }
}






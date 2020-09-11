import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isAuthenticated() == true){
      return true;
    }else{
      this.router.navigate(["/"]);
      return false;
    }
  }
}

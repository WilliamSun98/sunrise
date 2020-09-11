import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from '../../services/index';
import { concatMap, delay, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})

export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    auth = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.auth = false;
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        const example = this.authenticationService.authenticate(this.f.username.value, this.f.password.value)
          .pipe(
            concatMap(data => {
              const token = data['token'];
              this.loading = true;
              return this.authenticationService.login(this.f.username.value, this.f.password.value, token);
            })
          );

        example.pipe(first())
            .subscribe(
              user => {
                this.authenticationService.setRole(user['role']);
                this.router.navigate(['/home']);
              },
              error => {
                this.alertService.error(error);
                this.auth = true;
                this.loading = false;
              });

    }
}


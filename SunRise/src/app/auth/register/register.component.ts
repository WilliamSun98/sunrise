import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {first} from 'rxjs/operators';

import {AlertService, UserService, AuthenticationService} from '../../services/index';
import { Promise } from 'q';


@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  selectedValue = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      username: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      agree: [false]
    });
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.registerForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  submitForm() {
    this.submitted = true;

    for (const i in this.registerForm.controls) {
      this.registerForm.controls[i].markAsDirty();
      this.registerForm.controls[i].updateValueAndValidity();
    }

    // stop here if form is invalid
    if (this.registerForm.invalid) {
  
      return;
    }

    this.loading = true;
    this.authenticationService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Registration successful', true);
          this.router.navigate(['/']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
}

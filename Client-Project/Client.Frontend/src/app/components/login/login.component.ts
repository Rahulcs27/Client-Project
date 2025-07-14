import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthResponse } from './login-dtos';
import { NgxCaptchaModule } from 'ngx-captcha';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,NgxCaptchaModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginPasswordEyeOpen = false;
  siteKey= '6Ld9bIIrAAAAAP88S3Mdc5TVVnzqKRep7cqRIxli';
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required,]),
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{4,10}$'),]),
    recaptcha: new FormControl('', [Validators.required])
  })

  constructor(private loginService: LoginService,
    private alert: AlertService,
    private route: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('token') != null) {
      this.route.navigate(['/home']);
    }
  }

  onCaptchaResolved(token: string): void {
    this.loginForm.patchValue({ recaptcha: token });
  }
  loginUser() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    else {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;
      const recaptchaToken = this.loginForm.get('recaptcha')?.value;
      // captchaToken
      if (username && password && recaptchaToken) {
        this.loginService.login({ username, password, recaptchaToken }).subscribe({
          next: (response: AuthResponse) => {
            sessionStorage.setItem('token', response.token);
            this.alert.Toast.fire('Logged In Successfully', '', 'success')
            this.route.navigate(['/home']);
          },
          error: (error) => {
            console.error(error);
            this.loginForm.reset({
              username: '',
              password: '',
              // recaptcha: null,
            })
          }
        });
      }
    }
  }

  loginPasswordEyeToggle() {
    this.loginPasswordEyeOpen = !this.loginPasswordEyeOpen;
  }

}

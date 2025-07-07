import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthResponse } from './login-dtos';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  errorMsg = '';
  loginPasswordEyeOpen = false;
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required,]),
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{4,10}$'),])
  })

  constructor(private loginService: LoginService,
    private alert: AlertService,
    private route: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('token') != null) {
      this.route.navigate(['/home']);
    }
  }

  loginUser() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    else {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;
      if(username && password){
        this.loginService.login({username,password}).subscribe({
          next: (response: AuthResponse) => {
            sessionStorage.setItem('token', response.token);
            this.alert.Toast.fire('Logged In Successfully', '', 'success')
            this.route.navigate(['/home']);
          },
          error: (error) => {
            console.error(error);
          }
        });
      }
    }
  }

  loginPasswordEyeToggle() {
    this.loginPasswordEyeOpen = !this.loginPasswordEyeOpen;
  }

}

import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AlertService } from './services/alert.service';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Client.Frontend';
  userName: string | null = '';

  constructor( 
    private route: Router,
    private alert: AlertService, 
    private loginService: LoginService) { }

  checkLogin = (): boolean => {
    if(sessionStorage.getItem('token') != null){
      this.userName = this.loginService.user();
      return true;
    }
    return false;
  };

  logoutUser() {
    sessionStorage.clear();
    this.route.navigate(['/'])
    this.alert.Toast.fire('Logged Out Successfully', '', 'success');
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule,RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  userName: string | null = '';
  userRole: number | null = 0;

  constructor(private loginService: LoginService) { }
  ngOnInit(): void {
    this.userName = this.loginService.user();
    this.userRole = this.loginService.role();
  }
}

import { Component } from '@angular/core';
import { RoleAccessService } from '../../services/role-access.service';
import { RoleAccessDto } from './role-access-dto';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-role-access',
  imports: [CommonModule, FormsModule],
  templateUrl: './role-access.component.html',
  styleUrls: ['../../../componentStyle.css','./role-access.components.css']
})
export class RoleAccessComponent {
  username: string | null = null;
  data: RoleAccessDto[] = []
  constructor(
    private roleAccessService: RoleAccessService,
  ) { }

  onSearch(value: string) {
    if(value !== ''){
      this.roleAccessService.getUserAccess(value).subscribe({
        next: (response: RoleAccessDto[]) => {
          this.data = response;
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
    else {
      this.data = [];
    }
  }

  saveRoleAccess(form: NgForm) {
    console.log(form.value);
  }
}

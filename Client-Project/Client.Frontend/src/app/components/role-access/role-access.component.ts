import { Component, OnInit } from '@angular/core';
import { RoleAccessService } from '../../services/role-access.service';
import { RoleAccessByRoleIdDto, RoleAccessDto } from './role-access-dto';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { RoleGetDto } from '../role/role-dtos';

@Component({
  selector: 'app-role-access',
  imports: [CommonModule, FormsModule],
  templateUrl: './role-access.component.html',
  styleUrls: ['../../../componentStyle.css','./role-access.components.css']
})
export class RoleAccessComponent implements OnInit {
  screenCode: string | null = null;
  createAccess: boolean = false;
  editAccess: boolean = false;
  deleteAccess: boolean = false;
  username: string | null = null;
  data: RoleAccessByRoleIdDto[] = [];
  roles: RoleGetDto[] = [];
  constructor(
    private route: ActivatedRoute,
    private roleAccessService: RoleAccessService,
    private roleService: RoleService,
  ) { }
  ngOnInit(): void {
    this.roleService.getAllRoleGetDto().subscribe({
      next: (response: RoleGetDto[]) => {
        this.roles = response;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  onSearch(value: string) {
    if(value !== ''){
      this.roleAccessService.getRoleAccessByRoleId(Number(value)).subscribe({
        next: (response: RoleAccessByRoleIdDto[]) => {
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

declare var bootstrap: any;
import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserMasterService } from '../../services/user-master.service';
import { AlertService } from '../../services/alert.service';
import { UserGetDto } from './user-dtos';
import { TableComponent } from "../utils/table/table.component";
import { RoleGetDto } from '../role/role-dtos';
import { RoleService } from '../../services/role.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-user-master',
  imports: [CommonModule, ReactiveFormsModule, TableComponent],
  templateUrl: './user-master.component.html',
  styleUrl: '../../../componentStyle.css'
})
export class UserMasterComponent {
  constructor(
    private loginService: LoginService,
    private userService: UserMasterService,
    private roleService: RoleService,
    private alert: AlertService
  ) { }
  modalMode: 'add' | 'edit' = 'edit';
  displayedColumns: string[] = ['username', 'roleName', 'action'];
  roles: RoleGetDto[] = [];
  data: UserGetDto[] = [];
  columnsInfo: {
    [key: string]: {
      'title'?: string,
      'isSort'?: boolean,
      'templateRef': TemplateRef<any> | null,
    }
  } = {};
  @ViewChild('actionTemplateRef', { static: true }) actionTemplateRef!: TemplateRef<any>;

  userForm: FormGroup = new FormGroup(
    {
      id: new FormControl(''),
      roleMasterId: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      companyId: new FormControl('', [Validators.required]),
      currentPassword: new FormControl(''),
      newPassword: new FormControl(''),
      updatedBy: new FormControl(''),
      createdBy: new FormControl(''),
    }
  );

  ngOnInit(): void {
    this.roleService.getAllRoleGetDto().subscribe({
      next: (response: RoleGetDto[]) => {
        this.roles = response;
      },
      error: (error) => {
        console.log(error)
      }
    })
    this.getAllUserGetDto()
    this.columnsInfo = {
      'username': {
        'title': 'Name',
        'isSort': true,
        'templateRef': null
      },
      'roleName': {
        'title': 'Role',
        'isSort': true,
        'templateRef': null
      },
      'action': {
        'title': 'Action',
        'templateRef': this.actionTemplateRef
      }
    }

  }

  getAllUserGetDto() {
    this.userService.getAllUserGetDto().subscribe({
      next: (response: UserGetDto[]) => {
        this.data = response;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  closeModal() {
    this.userForm.reset({
      id: '',
      roleMasterId: '',
      username: '',
      password: '',
      companyId: '',
      currentPassword: '',
      newPassword: '',
      createdBy: '',
      updatedBy: '',
    })
    this.modalMode = 'edit';
  }

  addUserGetDto() {
    this.userForm.patchValue({
      companyId: this.loginService.companyId(),
      currentPassword: '',
      newPassword: '',
      createdBy: this.loginService.userId(),
    })
    this.modalMode = 'add';
  }

  editUserGetDto(obj: UserGetDto) {
    this.userForm.patchValue({
      id: obj.id,
      roleMasterId: obj.roleMasterId,
      username: obj.username,
      password: obj.password,
      companyId: this.loginService.companyId(),
      currentPassword: '',
      newPassword: '',
      updatedBy: this.loginService.userId(),
    })
    this.modalMode = 'edit'
  }

  deleteRowData(id: number) {
    this.alert.Delete.fire().then((result) => {
      if (result.isConfirmed) {
        console.log('Confirmed!');
      } else {
        console.log('Cancelled');
      }
    });
  }

  saveUserGetDto() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      console.log('User master form invalid', this.userForm.value);
    }
    else {
      if (this.modalMode === 'add') {
        // this.userForm.get('createdBy')?.setValue(1);
        this.userService.addUserGetDto(this.userForm.value).subscribe(
          {
            next: (response: UserGetDto[]) => {
              this.data = response;
              this.alert.Toast.fire('Added Successfully', '', 'success')
              this.closeModal();
              const modalElement = document.getElementById('user-modal');
              if (modalElement) {
                const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modalInstance.hide();
              }
            },
            error: (error) => {
              console.log(error);
            }
          }
        );
      }
      else if (this.modalMode === 'edit') {
        this.userService.editUserUpdateDto(this.userForm.value).subscribe({
          next: (response: UserGetDto[]) => {
            this.data = response
            this.alert.Toast.fire('Updated Successfully', '', 'success')
            this.closeModal();
            const modalElement = document.getElementById('user-modal');
            if (modalElement) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
              modalInstance.hide();
            }
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    }
  }
}

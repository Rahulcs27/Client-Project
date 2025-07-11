declare var bootstrap: any;
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserMasterService } from '../../services/user-master.service';
import { UserGetDto } from '../user-master/user-dtos';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css', '../../../componentStyle.css']
})
export class SideBarComponent {
  modalMode: 'password' | 'email' | 'userName' | null = null;
  userName: string | null = '';
  userRole: string | null = '';
  userId: number | null = null;
  companyId: number | null = null;

  constructor(
    private alert: AlertService,
    private loginService: LoginService,
    private userService: UserMasterService
  ) { }
  ngOnInit(): void {
    this.userName = this.loginService.user();
    this.userRole = this.loginService.role();
    this.companyId = this.loginService.companyId();
    this.userId = this.loginService.userId();
  }

  userChangeForm: FormGroup = new FormGroup(
    {
      id: new FormControl(''),
      roleMasterId: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      companyId: new FormControl('', [Validators.required]),
      currentPassword: new FormControl(''),
      newPassword: new FormControl(''),
      updatedBy: new FormControl(''),
      createdBy: new FormControl(''),
    }
  );

  closeModal() {
    this.userChangeForm.reset({
      id: '',
      roleMasterId: '',
      username: '',
      email: '',
      password: '',
      companyId: '',
      currentPassword: '',
      newPassword: '',
      updatedBy: '',
    })
    this.modalMode = null;
  }

  patchValue() {
    if (this.companyId && this.userId) {
      this.userService.getUserGetDto(this.companyId, this.userId).subscribe({
        next: (response: UserGetDto[]) => {
          if (response.length > 0) {
            const user = response[0];
            this.userChangeForm.patchValue({
              id: user.id,
              roleMasterId: user.roleMasterId,
              username: user.username,
              email: user.email,
              password: user.password,
              companyId: user.companyId,
              updatedBy: this.userId,
            })
          }
          else {
            this.loginService.logout()
          }
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
    else {
      this.loginService.logout()
    }
  }

  changePassword() {
    this.patchValue();
    this.modalMode = 'password'
  }

  changeUserName() {
    this.patchValue();
    this.modalMode = 'userName'
  }

  changeEmail() {
    this.patchValue();
    this.modalMode = 'email'
  }

  saveUserGetDto() {
    if (this.modalMode === 'password') {
      this.userService.editUserUpdateDto(this.userChangeForm.value).subscribe({
        next: (response: UserGetDto[]) => {
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
    else if (this.modalMode === 'userName' || this.modalMode === 'email') {
      this.userService.editUserUpdateDto(this.userChangeForm.value).subscribe({
        next: (response: UserGetDto[]) => {
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
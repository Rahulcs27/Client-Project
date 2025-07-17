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
  userRole: string | null = '';
  userId: number | null = null;
  companyId: number | null = null;
  user?: UserGetDto;

  constructor(
    private alert: AlertService,
    private loginService: LoginService,
    private userService: UserMasterService
  ) { }
  ngOnInit(): void {
    this.userRole = this.loginService.role();
    this.companyId = this.loginService.companyId();
    this.userId = this.loginService.userId();
    if (this.companyId && this.userId) {
      this.userService.getUserGetDto(this.companyId, this.userId).subscribe({
        next: (response: UserGetDto[]) => {
          if (response.length > 0) {
            this.user = response[0];
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

  userChangeForm: FormGroup = new FormGroup(
    {
      id: new FormControl(''),
      roleMasterId: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      companyId: new FormControl('', [Validators.required]),
      currentPassword: new FormControl('', [Validators.required,]),
      newPassword: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{4,10}$'),]),
      updatedBy: new FormControl(''),
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
  }

  patchValue() {
    this.userChangeForm.patchValue({
      id: this.user?.id,
      roleMasterId: this.user?.roleMasterId,
      username: this.user?.username,
      email: this.user?.email,
      password: this.user?.password,
      companyId: this.user?.companyID,
      updatedBy: this.userId,
    })
  }

  saveUserGetDto() {
    if(this.userChangeForm.invalid){
      this.userChangeForm.markAllAsTouched();
      console.log('Password Change Form Invalid: ', this.userChangeForm.value);
    }
    else{
      this.userService.editUserUpdateDto(this.userChangeForm.value).subscribe({
        next: (response: UserGetDto[]) => {
          this.alert.Toast.fire('Updated Successfully', '', 'success')
          this.closeModal();
          const modalElement = document.getElementById('change-modal');
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();
          }
          this.loginService.logout();
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }
}
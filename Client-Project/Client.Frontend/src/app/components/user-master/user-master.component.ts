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
import { ExportFileService } from '../../services/export-file.service';
import { ActivatedRoute } from '@angular/router';
import { RoleAccessService } from '../../services/role-access.service';

@Component({
  selector: 'app-user-master',
  imports: [CommonModule, ReactiveFormsModule, TableComponent],
  templateUrl: './user-master.component.html',
  styleUrl: '../../../componentStyle.css'
})
export class UserMasterComponent {
  userId: number | null = null;
  companyID: number | null = null;
  screenCode: string | null = null;
  createAccess: boolean = false;
  editAccess: boolean = false;
  deleteAccess: boolean = false;
  searchVaue: string = '';
  constructor(
    private route: ActivatedRoute,
    private roleAccessService: RoleAccessService,
    private exportService: ExportFileService,
    private loginService: LoginService,
    private userService: UserMasterService,
    private roleService: RoleService,
    private alert: AlertService
  ) { }
  modalMode: 'add' | 'edit' | 'view' = 'view';
  displayedColumns: string[] = ['username', 'roleName', 'action'];
  roles: RoleGetDto[] = [];
  data: UserGetDto[] = [];
  fullData: UserGetDto[] = [];
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
      username: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(70)]),
      password: new FormControl(''),
      companyID: new FormControl('', [Validators.required]),
      updatedBy: new FormControl(''),
      createdBy: new FormControl(''),
    }
  );

  setPasswordValidator() {
    const passwordControl = this.userForm.get('password');

    if (this.modalMode === 'add') {
      passwordControl?.setValidators([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{4,10}$'),]);
    } else {
      passwordControl?.clearValidators();
    }
    passwordControl?.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.userId = this.loginService.userId();
    this.companyID = this.loginService.companyId();
    this.screenCode = this.route.snapshot.data['screenCode'];
    if (this.userId && this.companyID && this.screenCode) {
      this.roleService.getAllRoleGetDto().subscribe({
        next: (response: RoleGetDto[]) => {
          this.roles = response;
        },
        error: (error) => {
          console.log(error)
        }
      })

      this.userService.getAllUserGetDto(this.companyID).subscribe({
        next: (response: UserGetDto[]) => {
          this.data = response;
          this.fullData = response;
        },
        error: (error) => {
          this.alert.Toast.fire((error.error)?error.error:((error.message)?error.message:'Something went wrong'),'','error');
            console.error(error);
        }
      });

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

      const roleAccessList = this.roleAccessService.getAccessList().find(item => item.a_screenCode === this.screenCode);
      
      if(roleAccessList){
        this.createAccess = roleAccessList.a_createAccess;
        this.editAccess = roleAccessList.a_editAccess;
        this.deleteAccess = roleAccessList.a_deleteAccess;
      }
    }
    else {
      this.loginService.logout();
    }
  }

  exportToPdf() {
    this.exportService.printToPDF('table', 'userMaster.pdf', [
      'Name',
      'Role',
    ])
  }

  exportToExcel() {
    this.exportService.printToExcel('table', 'userMaster.xlsx', [
      'Name',
      'Role',
    ])
  }

  setSearchValue(value: string) {
    this.searchVaue = value;
  }

  onSearch() {
    this.data = this.fullData.filter(d => d.username.includes(this.searchVaue));
  }

  closeModal() {
    this.userForm.reset({
      id: '',
      roleMasterId: '',
      username: '',
      email: '',
      password: '',
      companyID: '',
      createdBy: '',
      updatedBy: '',
    })
    this.modalMode = 'view';
  }

  addUserGetDto() {
    this.modalMode = 'add';
    this.userForm.patchValue({
      companyID: this.companyID,
      createdBy: this.userId,
    })
    this.userForm.enable();
    this.setPasswordValidator()
  }

  viewAndEditUserGetDto(obj: UserGetDto, mode: 'view' | 'edit') {
    this.modalMode = mode;
    this.userForm.patchValue({
      id: obj.id,
      roleMasterId: obj.roleMasterId,
      username: obj.username,
      email: obj.email,
      companyID: this.companyID,
      updatedBy: this.userId,
    })
    if (mode === 'view') {
      this.userForm.disable();
    }
    else {
      this.userForm.enable();
    }
    this.setPasswordValidator();
  }

  deleteRowData(id: number) {
    this.alert.Delete.fire().then((result) => {
      if (result.isConfirmed && this.userId && this.companyID) {
        this.userService.deleteUserGetDto(id, this.userId, this.companyID).subscribe({
          next: (response: UserGetDto[]) => {
            this.fullData = response;
            this.onSearch();
            this.alert.Toast.fire('Deleted Successfully', '', 'success');
          },
          error: (error) => {
            this.alert.Toast.fire((error.error)?error.error:((error.message)?error.message:'Something went wrong'),'','error');
            console.error(error);
          }
        });
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
        this.userService.addUserGetDto(this.userForm.value).subscribe(
          {
            next: (response: UserGetDto[]) => {
              this.fullData = response;
              this.onSearch();
              this.alert.Toast.fire('Added Successfully', '', 'success')
              this.closeModal();
              const modalElement = document.getElementById('user-modal');
              if (modalElement) {
                const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modalInstance.hide();
              }
            },
            error: (error) => {
              this.alert.Toast.fire((error.error)?error.error:((error.message)?error.message:'Something went wrong'),'','error');
            console.error(error);
            }
          }
        );
      }
      else if (this.modalMode === 'edit') {
        this.userService.editUserUpdateDto(this.userForm.value).subscribe({
          next: (response: UserGetDto[]) => {
            this.fullData = response;
            this.onSearch()
            this.alert.Toast.fire('Updated Successfully', '', 'success')
            this.closeModal();
            const modalElement = document.getElementById('user-modal');
            if (modalElement) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
              modalInstance.hide();
            }
          },
          error: (error) => {
            this.alert.Toast.fire((error.error)?error.error:((error.message)?error.message:'Something went wrong'),'','error');
            console.error(error);
          }
        });
      }
    }
  }
}

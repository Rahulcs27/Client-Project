declare var bootstrap: any;
import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableComponent } from '../utils/table/table.component';
import { AlertService } from '../../services/alert.service';
import { RoleGetDto } from './role-dtos';
import { RoleService } from '../../services/role.service';
import { ExportFileService } from '../../services/export-file.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-role',
  imports: [CommonModule, ReactiveFormsModule, TableComponent],
  templateUrl: './role.component.html',
  styleUrl: '../../../componentStyle.css'
})
export class RoleComponent {
  userId: number | null = null;
  constructor(
    private loginService: LoginService,
    private exportService: ExportFileService,
    private roleService: RoleService,
    private alert: AlertService
  ) { }
  modalMode: 'edit' | 'add' = 'edit';
  displayedColumns: string[] = ['roleName', 'description', 'action'];
  data: RoleGetDto[] = [];
  columnsInfo: {
    [key: string]: {
      'title'?: string,
      'isSort'?: boolean,
      'templateRef': TemplateRef<any> | null,
    }
  } = {};
  @ViewChild('actionTemplateRef', { static: true }) actionTemplateRef!: TemplateRef<any>;

  roleForm: FormGroup = new FormGroup(
    {
      id: new FormControl(''),
      roleName: new FormControl('', [Validators.required, Validators.maxLength(50),]),
      description: new FormControl('', [Validators.required, Validators.maxLength(255),]),
      createdBy: new FormControl(''),
      updatedBy: new FormControl(''),
    }
  );

  ngOnInit(): void {
    this.userId = this.loginService.userId();
    if (this.userId) {
      this.roleService.getAllRoleGetDto().subscribe({
        next: (response: RoleGetDto[]) => {
          this.data = response;
        },
        error: (error) => {
          console.log(error);
        }
      });
      this.columnsInfo = {
        'roleName': {
          'title': 'Role',
          'isSort': true,
          'templateRef': null
        },
        'description': {
          'title': 'Description',
          'isSort': true,
          'templateRef': null
        },
        'action': {
          'title': 'Action',
          'templateRef': this.actionTemplateRef
        }
      }
    }
    else {
      this.loginService.logout();
    }

  }

  closeModal() {
    this.roleForm.reset({
      id: '',
      description: '',
      roleName: '',
      createdBy: '',
      updatedBy: '',
    })
    this.modalMode = 'edit';
  }

  addRoleGetDto() {
    this.modalMode = 'add';
  }

  editRoleGetDto(obj: RoleGetDto) {
    this.roleForm.patchValue({
      id: obj.id,
      description: obj.description,
      roleName: obj.roleName,
      updatedBy: this.userId
    })
    this.modalMode = 'edit';
  }

  deleteRowData(id: number) {
    this.alert.Delete.fire().then((result) => {
      if (result.isConfirmed && this.userId) {
        this.roleService.deleteRoleGetDto(id, this.userId).subscribe({
          next: (response) => {
            this.data = response
            this.alert.Toast.fire('Deleted Successfully', '', 'success');
          },
          error: (error) => {
            console.log(error);
          }
        })
      }
    });
  }

  exportToPdf() {
    this.exportService.printToPDF('table', 'roleMaster.pdf', [
      'Role',
      'Description',
    ])
  }

  exportToExcel() {
    this.exportService.printToExcel('table', 'roleMaster.xlsx', [
      'Role',
      'Description',
    ])
  }

  saveRoleGetDto() {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      console.log('Role form invalid', this.roleForm.value);
    }
    else {
      if (this.modalMode === 'edit') {
        this.roleService.editRoleUpdateDto(this.roleForm.value).subscribe({
          next: (response: RoleGetDto[]) => {
            this.data = response;
            this.alert.Toast.fire('Updated Successfully', '', 'success');
            this.closeModal();
            const modalElement = document.getElementById('role-modal');
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
      else if (this.modalMode === 'add') {
        this.roleForm.get('createdBy')?.setValue(this.userId);
        this.roleService.addRoleGetDto(this.roleForm.value).subscribe(
          {
            next: (response: RoleGetDto[]) => {
              this.data = response
              this.alert.Toast.fire('Added Successfully', '', 'success');
              this.closeModal();
              const modalElement = document.getElementById('role-modal');
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
    }
  }
}

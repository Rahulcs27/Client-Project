declare var bootstrap: any;
import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableComponent } from '../utils/table/table.component';
import { AlertService } from '../../services/alert.service';
import { RoleGetDto } from './role-dtos';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-role',
  imports: [CommonModule,ReactiveFormsModule,TableComponent],
  templateUrl: './role.component.html',
  styleUrl: '../../../componentStyle.css'
})
export class RoleComponent {
  constructor(private roleService: RoleService,
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
    this.getAllRoleGetDto()
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

  getAllRoleGetDto() {
    this.roleService.getAllRoleGetDto().subscribe({
      next: (response: RoleGetDto[]) => {
        this.data = response;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  addRoleGetDto() {
    this.modalMode = 'add';
  }

  editRoleGetDto(obj: RoleGetDto) {
    this.roleForm.patchValue({
      id: obj.id,
      description: obj.description,
      roleName: obj.roleName,
      updatedBy: 1
    })
    this.modalMode = 'edit';
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
        this.roleForm.get('createdBy')?.setValue(1);
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

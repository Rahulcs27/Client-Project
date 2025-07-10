declare var bootstrap: any;
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { SubContractorService } from '../../services/sub-contractor.service';
import { AlertService } from '../../services/alert.service';
import { SubContractorGetDto } from './sub-contractor-dtos';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../utils/table/table.component';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-sub-contractor',
  imports: [CommonModule, TableComponent, ReactiveFormsModule],
  templateUrl: './sub-contractor.component.html',
  styleUrl: '../../../componentStyle.css'
})
export class SubContractorComponent {
  companyId: number | null = null;
  userId: number | null = null;
  constructor(
    private loginService: LoginService,
    private subContractorService: SubContractorService,
    private alert: AlertService
  ) { }
  modalMode: 'view' | 'edit' | 'add' = 'edit';
  displayedColumns: string[] = ['name', 'action'];
  data: SubContractorGetDto[] = [];
  columnsInfo: {
    [key: string]: {
      'title'?: string,
      'isSort'?: boolean,
      'templateRef': TemplateRef<any> | null,
    }
  } = {};
  @ViewChild('actionTemplateRef', { static: true }) actionTemplateRef!: TemplateRef<any>;

  subContractorForm: FormGroup = new FormGroup(
    {
      id: new FormControl(''),
      companyId: new FormControl('', [Validators.required,]),
      name: new FormControl('', [Validators.required, Validators.maxLength(50),]),
      createdBy: new FormControl(''),
      updatedBy: new FormControl(''),
    }
  );

  ngOnInit(): void {
    this.companyId = this.loginService.companyId()
    this.userId = this.loginService.userId()
    if (this.companyId && this.userId) {
      this.subContractorService.getAllSubContractorGetDto(this.companyId).subscribe({
        next: (response: SubContractorGetDto[]) => {
          this.data = response;
        },
        error: (error) => {
          console.log(error);
        }
      });
      this.columnsInfo = {
        'name': {
          'title': 'Sub Contractor',
          'isSort': true,
          'templateRef': null
        },
        'action': {
          'title': 'Action',
          'templateRef': this.checkViewer() ? null : this.actionTemplateRef
        }
      }
    }
    else {
      this.loginService.logout()
    }

  }

  checkViewer = (): boolean => this.loginService.role() !== null && this.loginService.role() === 'Viewer';

  closeModal() {
    this.subContractorForm.reset({
      id: '',
      companyId: '',
      name: '',
      createdBy: '',
      updatedBy: '',
    })
    this.modalMode = 'view';
  }

  addSubContractorGetDto() {
    this.subContractorForm.patchValue({
      companyId: this.companyId,
      createdBy: this.userId,
    })
    this.modalMode = 'add';
  }

  viewAndEditSubContractorGetDto(obj: SubContractorGetDto, mode: 'view' | 'edit') {
    this.subContractorForm.patchValue({
      id: obj.id,
      companyId: obj.companyId,
      name: obj.name,
      updatedBy: this.userId,
    })
    if (mode === 'view') {
      this.subContractorForm.disable();
    }
    else {
      this.subContractorForm.enable();
    }
    this.modalMode = mode;
  }

  deleteRowData(id: number) {
    this.alert.Delete.fire().then((result) => {
      if (result.isConfirmed && this.userId && this.companyId) {
        this.subContractorService.deleteSubContractorGetDto(id, this.userId, this.companyId).subscribe({
          next: (response: SubContractorGetDto[]) => {
            this.data = response;
            this.alert.Toast.fire('Deleted Successfully', '', 'success');
          },
          error: (error) => {
            console.log(error);
          }
        })
      }
    });
  }

  saveSubContractorGetDto() {
    if (this.subContractorForm.invalid) {
      this.subContractorForm.markAllAsTouched();
      console.log('SubContractor form invalid', this.subContractorForm.value);
    }
    else {
      if (this.modalMode === 'edit') {
        this.subContractorService.editSubContractorUpdateDto(this.subContractorForm.value).subscribe({
          next: (response: SubContractorGetDto[]) => {
            this.data = response;
            this.alert.Toast.fire('Updated Successfully', '', 'success');
            this.closeModal();
            const modalElement = document.getElementById('subContractor-modal');
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
        this.subContractorService.addSubContractorGetDto(this.subContractorForm.value).subscribe(
          {
            next: (response: SubContractorGetDto[]) => {
              this.data = response
              this.alert.Toast.fire('Added Successfully', '', 'success');
              this.closeModal();
              const modalElement = document.getElementById('subContractor-modal');
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

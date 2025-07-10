declare var bootstrap: any;
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { SubContractorService } from '../../services/sub-contractor.service';
import { AlertService } from '../../services/alert.service';
import { SubContractorGetDto } from './sub-contractor-dtos';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../utils/table/table.component';
import { CompanyMasterServiceService } from '../../services/company-master-service.service';
import { CompanyMasterGetDto } from '../company-master/company-master-dtos';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-sub-contractor',
  imports: [CommonModule,TableComponent,ReactiveFormsModule],
  templateUrl: './sub-contractor.component.html',
  styleUrl: '../../../componentStyle.css'
})
export class SubContractorComponent {
  constructor(
    private loginService: LoginService,
    private subContractorService: SubContractorService,
    private companyService: CompanyMasterServiceService,
    private alert: AlertService
  ) { }
  modalMode: 'edit' | 'add' = 'edit';
  displayedColumns: string[] = ['companyId', 'name', 'action'];
  companies: CompanyMasterGetDto[] = [];
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
    this.companyService.getAllCompanyMasterGetDto().subscribe({
      next: (response: CompanyMasterGetDto[]) => {
        this.companies = response;
      },
      error: (error) => {
        console.log(error);
      }
    })
    this.getAllSubContractorGetDto()
    this.columnsInfo = {
      'companyId': {
        'title': 'Company Name',
        'isSort': true,
        'templateRef': null
      },
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

  checkViewer = (): boolean => this.loginService.role() !== null && this.loginService.role() === 'Viewer';

  closeModal() {
    this.subContractorForm.reset({
      id: '',
      companyId: '',
      name: '',
      createdBy: '',
      updatedBy: '',
    })
    this.modalMode = 'edit';
  }

  getAllSubContractorGetDto() {
    this.subContractorService.getAllSubContractorGetDto().subscribe({
      next: (response: SubContractorGetDto[]) => {
        this.data = response;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  addSubContractorGetDto() {
    this.modalMode = 'add';
  }

  editSubContractorGetDto(obj: SubContractorGetDto) {
    this.subContractorForm.patchValue({
      id: obj.id,
      companyId: obj.companyId,
      name: obj.name,
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
        this.subContractorForm.get('createdBy')?.setValue(1);
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

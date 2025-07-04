declare var bootstrap:any;
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableComponent } from '../utils/table/table.component';
import { CompanyMasterServiceService } from '../../services/company-master-service.service';
import { CompanyMasterGetDto } from './Modals/company-master-get-dto';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-company-master',
  imports: [TableComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './company-master.component.html',
  styleUrl: './company-master.component.css'
})
export class CompanyMasterComponent implements OnInit {
  constructor(private companyMasterService: CompanyMasterServiceService,
    private alert: AlertService
  ) { }
  modalMode: 'view' | 'edit' | 'add' = 'view';
  displayedColumns: string[] = ['name', 'phone', 'email', 'action'];
  data: CompanyMasterGetDto[] = [];
  columnsInfo: {
    [key: string]: {
      'title'?: string,
      'isSort'?: boolean,
      'templateRef': TemplateRef<any> | null,
    }
  } = {};
  @ViewChild('actionTemplateRef', { static: true }) actionTemplateRef!: TemplateRef<any>;

  companyMasterForm: FormGroup = new FormGroup(
    {
      id: new FormControl(''),
      name: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$'),]),
      email: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      createdBy: new FormControl(''),
      updatedBy: new FormControl(''),
    }
  );

  ngOnInit(): void {
    this.getAllCompanyMasterGetDto()
    this.columnsInfo = {
      'name': {
        'title': 'Name',
        'isSort': true,
        'templateRef': null
      },
      'phone': {
        'title': 'Phone No.',
        'isSort': true,
        'templateRef': null
      },
      'email': {
        'title': 'Email Address',
        'isSort': true,
        'templateRef': null
      },
      'action': {
        'title': 'Action',
        'templateRef': this.actionTemplateRef
      }
    }

  }

  getAllCompanyMasterGetDto() {
    this.companyMasterService.getAllCompanyMasterGetDto().subscribe({
      next: (response: CompanyMasterGetDto[]) => {
        this.data = response;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  closeModal() {
    this.companyMasterForm.reset({
      id: '',
      name: '',
      phone: '',
      email: '',
      address: '',
      createdBy: '',
      updatedBy: '',
    })
    this.companyMasterForm.get('name')?.enable();
    this.companyMasterForm.get('phone')?.enable();
    this.companyMasterForm.get('email')?.enable();
    this.companyMasterForm.get('address')?.enable();
    this.modalMode = 'view';
  }

  viewCompanyMasterGetDto(obj: CompanyMasterGetDto) {
    this.companyMasterForm.patchValue({
      name: obj.name,
      phone: obj.phone,
      email: obj.email,
      address: obj.address
    })
    this.companyMasterForm.get('name')?.disable();
    this.companyMasterForm.get('phone')?.disable();
    this.companyMasterForm.get('email')?.disable();
    this.companyMasterForm.get('address')?.disable();
    this.modalMode = 'view';
  }

  editCompanyMasterGetDto(obj: CompanyMasterGetDto) {
    this.companyMasterForm.patchValue({
      id: obj.id,
      name: obj.name,
      phone: obj.phone,
      email: obj.email,
      address: obj.address,
      updatedBy: 1
    })
    this.modalMode = 'edit';
  }

  addCompanyMasterGetDto() {
    this.modalMode = 'add';
  }

  saveCompanyMasterGetDto() {
    if(this.companyMasterForm.invalid){
      this.companyMasterForm.markAllAsTouched();
      console.log('company master form invalid', this.companyMasterForm.value);
    }
    else{
      if (this.modalMode === 'edit') {
        this.companyMasterService.editCompanyMasterUpdateDto(this.companyMasterForm.value).subscribe({
          next: (response: CompanyMasterGetDto) => {
            this.data = this.data.map(d => {
              if(d.id === response.id){
                d.name = response.name;
                d.phone = response.phone;
                d.email = response.email;
                d.address = response.address;
                return d
              }
              else{
                return d;
              }
            })
            this.alert.Toast.fire('Updated Successfully','','success')
            this.closeModal();
            const modalElement = document.getElementById('companyMaster-modal');
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
        this.companyMasterForm.get('createdBy')?.setValue(1);
        this.companyMasterService.addCompanyMasterGetDto(this.companyMasterForm.value).subscribe(
          {
            next: (response: CompanyMasterGetDto) => {
              this.data = [response,...this.data];
              this.alert.Toast.fire('Added Successfully','','success')
              this.closeModal();
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

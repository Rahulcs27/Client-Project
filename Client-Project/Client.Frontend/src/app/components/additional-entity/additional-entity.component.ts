declare var bootstrap: any;
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TableComponent } from '../utils/table/table.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdditionalEntityGetDto } from './additional-entity-dto';
import { AlertService } from '../../services/alert.service';
import { LoginService } from '../../services/login.service';
import { ExportFileService } from '../../services/export-file.service';
import { AdditionalEntityService } from '../../services/additional-entity.service';
import { SubContractorService } from '../../services/sub-contractor.service';
import { SubContractorGetDto } from '../sub-contractor/sub-contractor-dtos';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-additional-entity',
  imports: [TableComponent, CommonModule, ReactiveFormsModule, DatePickerModule],
  templateUrl: './additional-entity.component.html',
  styleUrl: '../../../componentStyle.css'
})
export class AdditionalEntityComponent {
  modalMode: 'view' | 'add' | 'edit' = 'view';
  searchVaue: string = '';
  userId: number | null = null;
  companyId: number | null = null;
  subContractors: SubContractorGetDto[] = [];
  fullData: AdditionalEntityGetDto[] = []
  data: AdditionalEntityGetDto[] = [];
  displayedColumns: string[] = ['r_date', 'r_subContractorName', 'r_type', 'r_quantity', 'r_amount', 'action'];
  columnsInfo: {
    [key: string]: {
      'title'?: string,
      'isSort'?: boolean,
      'templateRef': TemplateRef<any> | null,
    }
  } = {};
  @ViewChild('dateTemplateRef', { static: true }) dateTemplateRef!: TemplateRef<any>;
  @ViewChild('actionTemplateRef', { static: true }) actionTemplateRef!: TemplateRef<any>;
  constructor(
    private alert: AlertService,
    private loginService: LoginService,
    private additionalService: AdditionalEntityService,
    private exportService: ExportFileService,
    private subContractorService: SubContractorService,
  ) { }

  ngOnInit(): void {
    this.userId = this.loginService.userId();
    this.companyId = this.loginService.companyId();
    if (this.companyId && this.userId) {
      this.additionalService.getAllAdditionalEntityGetDto(this.companyId).subscribe({
        next: (response: AdditionalEntityGetDto[]) => {
          this.data = response;
          this.fullData = response;
        },
        error: (error) => {
          console.log(error);
        }
      });
      this.subContractorService.getAllSubContractorGetDto(this.companyId).subscribe({
        next: (response: SubContractorGetDto[]) => {
          this.subContractors = response;
        },
        error: (error) => {
          console.log(error);
        }
      })
      this.columnsInfo = {
        'r_type': {
          'title': 'Type',
          'isSort': true,
          'templateRef': null
        },
        'r_amount': {
          'title': 'Amount',
          'isSort': true,
          'templateRef': null
        },
        'r_quantity': {
          'title': 'Quantity',
          'isSort': true,
          'templateRef': null
        },
        'r_date': {
          'title': 'Date',
          'isSort': true,
          'templateRef': this.dateTemplateRef
        },
        'r_subContractorName': {
          'title': 'Sub-Contractor',
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

  additionalEntityForm: FormGroup = new FormGroup(
    {
      id: new FormControl(''),
      type: new FormControl('', [Validators.required, Validators.maxLength(50),]),
      amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$'),]),
      quantity: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+'),]),
      date: new FormControl('', [Validators.required]),
      companyId: new FormControl('', [Validators.required]),
      subContractorId: new FormControl('', [Validators.required]),
      createdBy: new FormControl(''),
      updatedBy: new FormControl(''),
    }
  );

  addAdditionalEntityGetDto() {
    this.additionalEntityForm.patchValue({
      companyId: this.companyId,
      createdBy: this.userId
    })
    this.additionalEntityForm.enable();
    this.modalMode = 'add';
  }

  exportToPdf() {
    this.exportService.printToPDF('table', 'additionalEntity.pdf', [
      'Type',
      'Amount',
      'Quantity',
      'Date',
      'Sub-Contractor',
    ])
  }

  exportToExcel() {
    this.exportService.printToExcel('table', 'additionalEntity.xlsx', [
      'Type',
      'Amount',
      'Quantity',
      'Date',
      'Sub-Contractor',
    ])
  }

  setSearchValue(value: string) {
    this.searchVaue = value;
  }

  onSearch() {
    this.data = this.fullData.filter(d => (d.r_subContractorName.includes(this.searchVaue) || d.r_type.includes(this.searchVaue)));
  }

  closeModal() {
    this.additionalEntityForm.reset({
      id: '',
      type:  '',
      amount: '',
      quantity: '',
      date: '',
      companyId: '',
      subContractorId: '',
      createdBy: '',
      updatedBy: '',
    })
    this.modalMode = 'view';
  }

  viewAdditionalEntityGetDto(obj: AdditionalEntityGetDto) {
    this.additionalEntityForm.patchValue({
      type:  obj.r_type,
      amount: obj.r_amount,
      quantity: obj.r_quantity,
      date: new Date(obj.r_date),
      companyId: obj.r_companyId,
      subContractorId: obj.r_subContractorId,
    })
    this.additionalEntityForm.disable();
    this.modalMode = 'view';
  }

  editCompanyMasterGetDto(obj: AdditionalEntityGetDto) {
    this.additionalEntityForm.patchValue({
      id: obj.r_id,
      type:  obj.r_type,
      amount: obj.r_amount,
      quantity: obj.r_quantity,
      date: new Date(obj.r_date),
      companyId: obj.r_companyId,
      subContractorId: obj.r_subContractorId,
      updatedBy: this.userId,
    })
    this.additionalEntityForm.enable();
    this.modalMode = 'edit';
  }

  deleteRowData(id: number) {
    this.alert.Delete.fire().then((result) => {
      if (result.isConfirmed && this.userId && this.companyId) {
        this.additionalService.deleteAdditionalEntityGetDto(id, this.userId, this.companyId).subscribe({
          next: (response: AdditionalEntityGetDto[]) => {
            this.fullData = response;
            this.onSearch();
            this.alert.Toast.fire('Deleted Successfully', '', 'success');
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    });
  }

  saveAdditionalEntityGetDto() {
    if (this.additionalEntityForm.invalid) {
      this.additionalEntityForm.markAllAsTouched();
      console.log('Additional Entity form invalid', this.additionalEntityForm.value);
    }
    else {
      if (this.modalMode === 'edit') {
        this.additionalService.editAdditionalEntityUpdateDto(this.additionalEntityForm.value).subscribe({
          next: (response: AdditionalEntityGetDto[]) => {
            this.fullData = response;
            this.onSearch()
            this.alert.Toast.fire('Updated Successfully', '', 'success')
            this.closeModal();
            const modalElement = document.getElementById('AdditionalEntity-modal');
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
        this.additionalService.addAdditionalEntityGetDto(this.additionalEntityForm.value).subscribe(
          {
            next: (response: AdditionalEntityGetDto[]) => {
              this.fullData = response;
              this.onSearch();
              this.alert.Toast.fire('Added Successfully', '', 'success')
              this.closeModal();
              const modalElement = document.getElementById('AdditionalEntity-modal');
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

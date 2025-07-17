declare var bootstrap: any;
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TableComponent } from "../utils/table/table.component";
import { InvoiceService } from '../../services/invoice.service';
import { AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InvoiceGetDto } from './invoice-dtos';
import { ProductGetDto } from '../product/product-dtos';
import { ProductService } from '../../services/product.service';
import { SubContractorGetDto } from '../sub-contractor/sub-contractor-dtos';
import { SubContractorService } from '../../services/sub-contractor.service';
import { DatePickerModule } from 'primeng/datepicker';
import { LoginService } from '../../services/login.service';
import { ExportFileService } from '../../services/export-file.service';

@Component({
  selector: 'app-invoice',
  imports: [TableComponent, CommonModule, ReactiveFormsModule, DatePickerModule],
  templateUrl: './invoice.component.html',
  styleUrl: '../../../componentStyle.css',
})
export class InvoiceComponent {
  companyId: number | null = null;
  userId: number | null = null;
  constructor(
    private exportService: ExportFileService,
    private loginService: LoginService,
    private invoiceService: InvoiceService,
    private productService: ProductService,
    private subContractorService: SubContractorService,
    private alert: AlertService
  ) { }
  searchVaue: string = '';
  modalMode: 'view' | 'edit' | 'add' = 'view';
  displayedColumns: string[] = ['r_id', 'name', 'r_invoiceDate', 'r_status', 'r_quantity', 'r_totalAmount', 'action'];
  fullData: InvoiceGetDto[] = [];
  data: InvoiceGetDto[] = [];
  products: ProductGetDto[] = [];
  subContractors: SubContractorGetDto[] = [];
  columnsInfo: {
    [key: string]: {
      'title'?: string,
      'isSort'?: boolean,
      'templateRef': TemplateRef<any> | null,
    }
  } = {};
  @ViewChild('actionTemplateRef', { static: true }) actionTemplateRef!: TemplateRef<any>;
  @ViewChild('invoiceDateTemplateRef', { static: true }) invoiceDateTemplateRef!: TemplateRef<any>;

  invoiceForm: FormGroup = new FormGroup(
    {
      id: new FormControl(''),
      companyId: new FormControl(''),
      subcontractorId: new FormControl(''),
      productId: new FormControl('', [Validators.required,]),
      invoiceDate: new FormControl('', [Validators.required]),
      unitAmount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$'),]),
      status: new FormControl(''),
      quantity: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+'),]),
      totalAmount: new FormControl('', [Validators.required]),
      commissionPercentage: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$'),]),
      commissionAmount: new FormControl('', [Validators.required,]),
      paymentMode: new FormControl('', [Validators.required]),
      createdBy: new FormControl(''),
      updatedBy: new FormControl(''),
    }
  );

  ngOnInit(): void {
    this.userId = this.loginService.userId();
    this.companyId = this.loginService.companyId();
    if (this.userId && this.companyId) {
      this.invoiceForm.get('totalAmount')?.disable();
      this.productService.getAllProductGetDto(this.companyId).subscribe({
        next: (response: ProductGetDto[]) => {
          this.products = response
        },
        error: (error) => {
          console.log(error);
        }
      })
      this.subContractorService.getAllSubContractorGetDto(this.companyId).subscribe({
        next: (response: SubContractorGetDto[]) => {
          this.subContractors = response
        },
        error: (error) => {
          console.log(error);
        }
      })
      this.invoiceService.getAllInvoiceGetDto(this.companyId).subscribe({
        next: (response: InvoiceGetDto[]) => {
          this.fullData = response;
          this.data = response;
        },
        error: (error) => {
          console.log(error);
        }
      });
      this.columnsInfo = {
        'r_id': {
          'title': 'Invoice No.',
          'isSort': true,
          'templateRef': null
        },
        'name': {
          'title': 'Sub-Contract Name',
          'isSort': true,
          'templateRef': null
        },
        'r_invoiceDate': {
          'title': 'Invoice Date',
          'isSort': true,
          'templateRef': this.invoiceDateTemplateRef
        },
        'r_status': {
          'title': 'Status',
          'isSort': true,
          'templateRef': null
        },
        'r_quantity': {
          'title': 'Quantity',
          'isSort': true,
          'templateRef': null
        },
        'r_totalAmount': {
          'title': 'Total Amount',
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

  exportToPdf() {
    this.exportService.printToPDF('table', 'invoice.pdf', [
      'Invoice No.',
      'Sub-Contract Name',
      'Invoice Date',
      'Status',
      'Quantity',
      'Total Amount',
    ])
  }

  exportToExcel() {
    this.exportService.printToExcel('table', 'invoice.xlsx', [
      'Invoice No.',
      'Sub-Contract Name',
      'Invoice Date',
      'Status',
      'Quantity',
      'Total Amount',
    ])
  }

  setSearchValue(value: string) {
    this.searchVaue = value;
  }

  onSearch() {
    this.data = this.fullData.filter(d => (d.name.includes(this.searchVaue) || (Number(this.searchVaue) && d.r_id === Number(this.searchVaue))));
  }

  setUnitAmount(value: string) {
    this.invoiceForm.get('unitAmount')?.setValue((value !== '') ? value.split('_')[1] : '');
  }

  calculateTotalAmount() {
    const unitAmount = Number(this.invoiceForm.get('unitAmount')?.value)
    const quantity = Number(this.invoiceForm.get('quantity')?.value)
    this.invoiceForm.get('totalAmount')?.setValue((unitAmount && unitAmount > 0 && quantity && quantity > 0) ? unitAmount * quantity : '')
  }

  calculateCommissionAmount() {
    const commissionPercentage = Number(this.invoiceForm.get('commissionPercentage')?.value)
    const totalAmount = Number(this.invoiceForm.get('totalAmount')?.value)
    this.invoiceForm.get('commissionAmount')?.setValue((commissionPercentage && totalAmount) ? (Math.floor((commissionPercentage * totalAmount) / 100)) : '')
  }

  closeModal() {
    this.invoiceForm.reset({
      id: '',
      companyId: '',
      subcontractorId: '',
      productId: '',
      unitAmount: '',
      invoiceDate: '',
      quantity: '',
      totalAmount: '',
      commissionPercentage: '',
      commissionAmount: '',
      paymentMode: '',
      status: '',
      createdBy: '',
      updatedBy: '',
    })
    this.modalMode = 'view';
  }

  viewAndEditInvoiceGetDto(obj: InvoiceGetDto, mode: 'view' | 'edit') {
    this.invoiceForm.patchValue({
      id: obj.r_id,
      companyId: obj.r_companyId,
      subcontractorId: obj.r_subcontractorId,
      productId: obj.r_productId + '_' + obj.unitPrice,
      unitAmount: obj.r_unitAmount,
      invoiceDate: new Date(obj.r_invoiceDate),
      status: obj.r_status,
      quantity: obj.r_quantity,
      totalAmount: obj.r_totalAmount,
      commissionPercentage: obj.r_commissionPercentage,
      commissionAmount: obj.r_commissionAmount,
      paymentMode: obj.r_paymentMode,
      updatedBy: (mode === 'edit') && this.loginService.userId(),
    })
    if (mode === 'view') {
      this.invoiceForm.disable();
    }
    else {
      this.invoiceForm.enable();
      this.invoiceForm.get('totalAmount')?.disable();
      this.invoiceForm.get('commissionAmount')?.disable();
    }
    this.modalMode = mode;
  }

  addInvoiceGetDto() {
    this.invoiceForm.patchValue({
      companyId: this.loginService.companyId(),
      subcontractorId: '',
      createdBy: this.loginService.userId(),
    })
    this.invoiceForm.enable();
    this.invoiceForm.get('totalAmount')?.disable();
    this.invoiceForm.get('commissionAmount')?.disable();
    this.modalMode = 'add';
  }

  deleteRowData(id: number) {
    this.alert.Delete.fire().then((result) => {
      if (result.isConfirmed && this.userId && this.companyId) {
        this.invoiceService.deleteInvoiceGetDto(id, this.companyId, this.userId).subscribe({
          next: (response: InvoiceGetDto[]) => {
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

  saveInvoiceGetDto() {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      console.log('Invoice form invalid', this.invoiceForm.value);
    }
    else {
      const formData = this.invoiceForm.value;
      formData['productId'] = (this.invoiceForm.get('productId')?.value).split('_')[0];
      formData['totalAmount'] = this.invoiceForm.get('totalAmount')?.value
      formData['commissionAmount'] = this.invoiceForm.get('commissionAmount')?.value
      if (this.modalMode === 'edit') {
        this.invoiceService.editInvoiceUpdateDto(formData).subscribe({
          next: (response: InvoiceGetDto[]) => {
            this.fullData = response;
            this.onSearch();
            this.alert.Toast.fire('Updated Successfully', '', 'success')
            this.closeModal()
            const modalElement = document.getElementById('invoice-modal');
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
        this.invoiceService.addInvoiceGetDto(formData).subscribe(
          {
            next: (response: InvoiceGetDto[]) => {
              this.fullData = response;
              this.onSearch();
              this.alert.Toast.fire('Added Successfully', '', 'success')
              const modalElement = document.getElementById('invoice-modal');
              this.closeModal()
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

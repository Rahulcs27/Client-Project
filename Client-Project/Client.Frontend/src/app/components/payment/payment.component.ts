declare var bootstrap: any;
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { AlertService } from '../../services/alert.service';
import { InvoiceService } from '../../services/invoice.service';
import { PaymentGetDto } from './payment-dtos';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../utils/table/table.component';
import { InvoiceGetDto } from '../invoice/invoice-dtos';
import { ProductService } from '../../services/product.service';
import { ProductGetDto } from '../product/product-dtos';
import { SubContractorGetDto } from '../sub-contractor/sub-contractor-dtos';
import { SubContractorService } from '../../services/sub-contractor.service';
import { CompanyMasterGetDto } from '../company-master/company-master-dtos';
import { LoginService } from '../../services/login.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DatePickerModule } from 'primeng/datepicker';
import { ExportFileService } from '../../services/export-file.service';
import { BankGetDto } from '../bank-master/bank-dtos';
import { BankMasterService } from '../../services/bank-master.service';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, ReactiveFormsModule, TableComponent, AutoCompleteModule, DatePickerModule],
  templateUrl: './payment.component.html',
  styleUrl: '../../../componentStyle.css'
})
export class PaymentComponent {
  constructor(
    private bankService: BankMasterService,
    private exportService: ExportFileService,
    private loginService: LoginService,
    private paymentService: PaymentService,
    private invoiceService: InvoiceService,
    private productService: ProductService,
    private subContractorService: SubContractorService,
    private alert: AlertService
  ) {
    this.paymentForm.get('paymentMode')?.valueChanges.subscribe((mode) => {
      const bankControl = this.paymentForm.get('bankId');
      if (mode === 'CASH') {
        bankControl?.clearValidators();
        bankControl?.setValue('');
      } else {
        bankControl?.setValidators([Validators.required]);
      }
      bankControl?.updateValueAndValidity();
    });
  }
  fullData: PaymentGetDto[] = [];
  searchVaue: string = '';
  banks: BankGetDto[] = [];
  companyId: number | null = null;
  userId: number | null = null;
  modalMode: 'edit' | 'add' | 'view' = 'view';
  invoices: InvoiceGetDto[] = [];
  invoiceIds: any[] = [];
  products: ProductGetDto[] = [];
  companies: CompanyMasterGetDto[] = [];
  subContractors: SubContractorGetDto[] = [];
  displayedColumns: string[] = ['r_paymentDate', 'r_amountPaid', 'r_paymentMode', 'r_bankName', 'r_paymentStatus', 'action'];
  data: PaymentGetDto[] = [];
  columnsInfo: {
    [key: string]: {
      'title'?: string,
      'isSort'?: boolean,
      'templateRef': TemplateRef<any> | null,
    }
  } = {};
  @ViewChild('dateTemplateRef', { static: true }) dateTemplateRef!: TemplateRef<any>;
  @ViewChild('bankTemplateRef', { static: true }) bankTemplateRef!: TemplateRef<any>;
  @ViewChild('actionTemplateRef', { static: true }) actionTemplateRef!: TemplateRef<any>;

  paymentForm: FormGroup = new FormGroup(
    {
      id: new FormControl(''),
      invoiceId: new FormControl(null),
      companyId: new FormControl('', [Validators.required,]),
      paymentDate: new FormControl('', [Validators.required, Validators.maxLength(50),]),
      amountPaid: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$'),]),
      paymentMode: new FormControl('', [Validators.required, Validators.maxLength(50),]),
      bankId: new FormControl(''),
      paymentStatus: new FormControl('', [Validators.required, Validators.maxLength(50),]),
      createdBy: new FormControl(''),
      updatedBy: new FormControl(''),
    }
  );

  invoiceForm: FormGroup = new FormGroup(
    {
      companyId: new FormControl(''),
      subcontractorId: new FormControl(''),
      productId: new FormControl(''),
      invoiceDate: new FormControl(''),
      status: new FormControl(''),
      quantity: new FormControl(''),
      totalAmount: new FormControl(''),
      paymentMode: new FormControl(''),
    }
  );

  ngOnInit(): void {
    this.companyId = this.loginService.companyId();
    this.userId = this.loginService.userId();
    if (this.companyId && this.userId) {
      this.bankService.getAllBankMasterGetDto().subscribe({
        next: (response: BankGetDto[]) => {
          this.banks = response
        },
        error: (error) => {
          console.log(error);
        }
      })
      this.invoiceService.getAllInvoiceGetDto(this.companyId).subscribe({
        next: (response: InvoiceGetDto[]) => {
          this.invoices = response
        },
        error: (error) => {
          console.log(error);
        }
      })
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
      this.paymentService.getAllPaymentGetDto(this.companyId).subscribe({
        next: (response: PaymentGetDto[]) => {
          this.data = response;
          this.fullData = response;
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
    else {
      console.log('Login First');
    }

    this.columnsInfo = {
      'r_paymentDate': {
        'title': 'Date',
        'isSort': true,
        'templateRef': this.dateTemplateRef,
      },
      'r_amountPaid': {
        'title': 'Amount',
        'isSort': true,
        'templateRef': null
      },

      'r_paymentMode': {
        'title': 'Mode',
        'isSort': true,
        'templateRef': null
      },
      'r_bankName': {
        'title': 'Bank Name',
        'isSort': true,
        'templateRef': this.bankTemplateRef
      },
      'r_paymentStatus': {
        'title': 'Status',
        'isSort': true,
        'templateRef': null
      },
      'action': {
        'title': 'Action',
        'templateRef': this.actionTemplateRef
      }
    }
  }

  exportToPdf() {
    this.exportService.printToPDF('table', 'payment.pdf', [
      'Date',
      'Amount',
      'Mode',
      'Bank Name',
      'Status',
    ])
  }

  exportToExcel() {
    this.exportService.printToExcel('table', 'payment.xlsx', [
      'Date',
      'Amount',
      'Mode',
      'Bank Name',
      'Status',
    ])
  }

  checkViewer = (): boolean => this.loginService.role() !== null; //&& this.loginService.role() === 'Viewer';

  search(event: AutoCompleteCompleteEvent) {
    const query = event.query.toString();
    this.invoiceIds = this.invoices
      .filter(item => item.r_id.toString().includes(query))
      .map(item => item.r_id);
  }

  closeModal() {
    this.paymentForm.reset({
      id: '',
      invoiceId: null,
      paymentDate: '',
      amountPaid: '',
      paymentMode: '',
      bankId: '',
      paymentStatus: '',
      createdBy: '',
      updatedBy: '',
    })
    this.modalMode = 'view';
    this.paymentForm.enable();
  }

  // closeInvoiceModal() {
  //   this.invoiceForm.reset({
  //     companyId: '',
  //     subcontractorId: '',
  //     productId: '',
  //     invoiceDate: '',
  //     status: '',
  //     quantity: '',
  //     totalAmount: '',
  //     paymentMode: '',
  //   })
  // }

  setSearchValue(value: string) {
    this.searchVaue = value;
  }

  onSearch() {
    if(this.searchVaue !== ''){
      this.data = this.fullData.filter(d => d.r_bankName && d.r_bankName.includes(this.searchVaue));
    }
    else{
      this.data = this.fullData
    }
  }

  addPaymentGetDto() {
    this.paymentForm.patchValue({
      invoiceId: null,
      bankId: '',
      companyId: this.companyId,
      createdBy: this.userId,
    })
    this.modalMode = 'add';
    this.paymentForm.enable();
  }

  viewPaymentGetDto(obj: PaymentGetDto) {
    this.paymentForm.patchValue({
      id: obj.r_id,
      companyId: this.companyId,
      invoiceId: obj.r_invoiceId,
      paymentDate: new Date(obj.r_paymentDate),
      amountPaid: obj.r_amountPaid,
      paymentMode: obj.r_paymentMode,
      bankId: (!obj.r_bankId || obj.r_bankId === 0) ? '' : obj.r_bankId,
      paymentStatus: obj.r_paymentStatus,
      updatedBy: this.userId
    })
    this.modalMode = 'view';
    this.paymentForm.disable();
  }

  editPaymentGetDto(obj: PaymentGetDto) {
    this.paymentForm.patchValue({
      id: obj.r_id,
      companyId: this.companyId,
      invoiceId: obj.r_invoiceId,
      paymentDate: new Date(obj.r_paymentDate),
      amountPaid: obj.r_amountPaid,
      paymentMode: obj.r_paymentMode,
      bankId: (!obj.r_bankId || obj.r_bankId === 0) ? '' : obj.r_bankId,
      paymentStatus: obj.r_paymentStatus,
      updatedBy: this.userId
    })
    this.modalMode = 'edit';
    this.paymentForm.enable();
  }

  deleteRowData(id: number) {
    this.alert.Delete.fire().then((result) => {
      if (result.isConfirmed && this.companyId && this.userId) {
        this.paymentService.deletePaymentGetDto(id, this.userId, this.companyId).subscribe({
          next: (response: PaymentGetDto[]) => {
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

  // invoiceGetDto(invoiceId: number) {
  //   const invoice = this.invoices.find(i => i.r_id === invoiceId);
  //   this.invoiceForm.patchValue({
  //     companyId: invoice?.r_companyId,
  //     subcontractorId: invoice?.r_subcontractorId,
  //     productId: invoice?.r_productId,
  //     invoiceDate: invoice?.r_invoiceDate.split('T')[0],
  //     status: invoice?.r_status,
  //     quantity: invoice?.r_quantity,
  //     totalAmount: invoice?.r_totalAmount,
  //     paymentMode: invoice?.r_paymentMode,
  //   })
  //   this.invoiceForm.disable()
  // }

  savePaymentGetDto() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      console.log('Payment form invalid', this.paymentForm.value);
    }
    else {
      if (this.paymentForm.get('invoiceId')?.value === '') {
        this.paymentForm.get('invoiceId')?.setValue(null);
      }
      if (this.paymentForm.get('bankId')?.value === '') {
        this.paymentForm.get('bankId')?.setValue(null);
      }
      if (this.modalMode === 'edit') {
        this.paymentService.editPaymentUpdateDto(this.paymentForm.value).subscribe({
          next: (response: PaymentGetDto[]) => {
            this.fullData = response;
            this.onSearch()
            this.alert.Toast.fire('Updated Successfully', '', 'success');
            this.closeModal();
            const modalElement = document.getElementById('payment-modal');
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
        this.paymentService.addPaymentGetDto(this.paymentForm.value).subscribe(
          {
            next: (response: PaymentGetDto[]) => {
              this.fullData = response;
              this.onSearch()
              this.alert.Toast.fire('Added Successfully', '', 'success');
              this.closeModal();
              const modalElement = document.getElementById('payment-modal');
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

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
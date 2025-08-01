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
import { ActivatedRoute } from '@angular/router';
import { RoleAccessService } from '../../services/role-access.service';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, ReactiveFormsModule, TableComponent, AutoCompleteModule, DatePickerModule],
  templateUrl: './payment.component.html',
  styleUrl: '../../../componentStyle.css'
})
export class PaymentComponent {
  screenCode: string | null = null;
  createAccess: boolean = false;
  editAccess: boolean = false;
  deleteAccess: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private roleAccessService: RoleAccessService,
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
  banks: BankGetDto[] = [];
  companyId: number | null = null;
  userId: number | null = null;
  modalMode: 'edit' | 'add' | 'view' = 'view';
  invoices: InvoiceGetDto[] = [];
  invoiceIds: any[] = [];
  products: ProductGetDto[] = [];
  companies: CompanyMasterGetDto[] = [];
  subContractors: SubContractorGetDto[] = [];
  displayedColumns: string[] = ['r_invoiceNo', 'r_paymentDate', 'r_amountPaid', 'r_bankName', 'action'];
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
      invoiceNo: new FormControl(null),
      fromDate: new FormControl(null),
      toDate: new FormControl(null),
      companyId: new FormControl('', [Validators.required,]),
      paymentDate: new FormControl('', [Validators.required, Validators.maxLength(50),]),
      amountPaid: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$'),]),
      paymentMode: new FormControl('', [/*Validators.required,*/ Validators.maxLength(50),]),
      bankId: new FormControl(''),
      paymentStatus: new FormControl('', [/*Validators.required,*/ Validators.maxLength(50),]),
      createdBy: new FormControl(''),
      updatedBy: new FormControl(''),
    }
  );

  filterForm: FormGroup = new FormGroup({
    FromDate: new FormControl(null),
    ToDate: new FormControl(null),
    bankName: new FormControl(null),
  });

  ngOnInit(): void {
    this.companyId = this.loginService.companyId();
    this.userId = this.loginService.userId();
    this.screenCode = this.route.snapshot.data['screenCode'];
    if (this.companyId && this.userId && this.screenCode) {
      this.bankService.getAllBankMasterGetDto().subscribe({
        next: (response: BankGetDto[]) => {
          this.banks = response
        },
        error: (error) => {
          this.alert.Toast.fire((error.error)?error.error:((error.message)?error.message:'Something went wrong'),'','error');
            console.error(error);
        }
      })
      this.invoiceService.getAllInvoiceGetDto(this.companyId).subscribe({
        next: (response: InvoiceGetDto[]) => {
          this.invoices = response;
        },
        error: (error) => {
          this.alert.Toast.fire((error.error)?error.error:((error.message)?error.message:'Something went wrong'),'','error');
            console.error(error);
        }
      })
      this.productService.getAllProductGetDto(this.companyId).subscribe({
        next: (response: ProductGetDto[]) => {
          this.products = response
        },
        error: (error) => {
          this.alert.Toast.fire((error.error)?error.error:((error.message)?error.message:'Something went wrong'),'','error');
            console.error(error);
        }
      })
      this.subContractorService.getAllSubContractorGetDto(this.companyId).subscribe({
        next: (response: SubContractorGetDto[]) => {
          this.subContractors = response
        },
        error: (error) => {
          this.alert.Toast.fire((error.error)?error.error:((error.message)?error.message:'Something went wrong'),'','error');
            console.error(error);
        }
      })
      this.paymentService.getAllPaymentGetDto(this.companyId).subscribe({
        next: (response: PaymentGetDto[]) => {
          this.data = response;
          this.fullData = response;
        },
        error: (error) => {
          this.alert.Toast.fire((error.error)?error.error:((error.message)?error.message:'Something went wrong'),'','error');
            console.error(error);
        }
      });

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

      'r_invoiceNo': {
        'title': 'Invoice No.',
        'isSort': true,
        'templateRef': null
      },
      'r_bankName': {
        'title': 'Bank Name',
        'isSort': true,
        'templateRef': this.bankTemplateRef
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
      console.log('Login First');
    }
  }

  resetFilter() {
    this.filterForm.reset({
      FromDate: null,
      ToDate: null,
      bankName: null,
    })
  }

  exportToPdf() {
    this.exportService.printToPDF('table', 'payment.pdf', [
      'Invoice No.',
      'Date',
      'Amount',
      'Mode',
      'Bank Name',
    ])
  }

  exportToExcel() {
    this.exportService.printToExcel('table', 'payment.xlsx', [
      'Invoice No.',
      'Date',
      'Amount',
      'Mode',
      'Bank Name',
    ])
  }

  calculateAmount() {
    const fromDate = this.paymentForm.get('fromDate')?.value
    const toDate = this.paymentForm.get('toDate')?.value
    if(fromDate && toDate){
      const totalAmount = this.invoices.filter(invoice => (new Date(fromDate) <= new Date(invoice.r_invoiceDate) && new Date(invoice.r_invoiceDate) <= new Date(toDate) && invoice.r_status.toLowerCase() === 'pending')).reduce((acc, invoice) => acc + invoice.r_totalAmount,0)
      this.paymentForm.get('amountPaid')?.setValue(totalAmount)
    }
  }

  search(event: AutoCompleteCompleteEvent) {
    const query = event.query.toString();
    this.invoiceIds = this.invoices
      .filter(item => (item.r_invoiceNo.toString().includes(query)))
      .map(item => item.r_invoiceNo);
  }

  closeModal() {
    this.paymentForm.reset({
      id: '',
      invoiceNo: null,
      fromDate: null,
      toDate: null,
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

  calculateAmountByInvoiceNo(value: string){
    const totalAmount = this.invoices.find(invoice => invoice.r_invoiceNo === value)?.r_totalAmount;
    this.paymentForm.get('amountPaid')?.setValue(totalAmount);
  }

  onSearch() {
    const fromDate = this.filterForm.get('FromDate')?.value;
    const toDate = this.filterForm.get('ToDate')?.value;
    const bankName = this.filterForm.get('bankName')?.value;
    this.data = this.fullData.filter(d => (
      ((fromDate && new Date(fromDate) <= new Date(d.r_paymentDate) || !fromDate)) &&
      ((toDate && new Date(toDate) >= new Date(d.r_paymentDate)) || !toDate) &&
      ((bankName && (d.r_bankName.includes(bankName) || d.r_bankName.includes(bankName))) || !bankName)));
  }

  addPaymentGetDto() {
    this.paymentForm.patchValue({
      invoiceNo: null,
      fromDate: null,
      toDate: null,
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
      invoiceNo: obj.r_invoiceNo,
      paymentDate: new Date(obj.r_paymentDate),
      fromDate: (obj.r_fromDate) ? new Date(obj.r_fromDate) : null,
      toDate: (obj.r_toDate) ? new Date(obj.r_toDate) : null,
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
      invoiceNo: obj.r_invoiceNo,
      paymentDate: new Date(obj.r_paymentDate),
      fromDate: (obj.r_fromDate) ? new Date(obj.r_fromDate) : null,
      toDate: (obj.r_toDate) ? new Date(obj.r_toDate) : null,
      amountPaid: obj.r_amountPaid,
      paymentMode: obj.r_paymentMode,
      bankId: (!obj.r_bankId || obj.r_bankId === 0) ? '' : obj.r_bankId,
      paymentStatus: obj.r_paymentStatus,
      updatedBy: this.userId
    })
    console.log(obj.r_paymentStatus);
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
            this.alert.Toast.fire((error.error)?error.error:((error.message)?error.message:'Something went wrong'),'','error');
            console.error(error);
          }
        });
      } 
    });
  }

  savePaymentGetDto() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      console.log('Payment form invalid', this.paymentForm.value);
    }
    else {
      if (this.paymentForm.get('invoiceNo')?.value === '') {
        this.paymentForm.get('invoiceNo')?.setValue(null);
      }
      if (this.paymentForm.get('bankId')?.value === '') {
        this.paymentForm.get('bankId')?.setValue(null);
      }
      function getDateFormat(inputDate: string): string {
        const date = new Date(inputDate);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = String(date.getFullYear());
        return `${yyyy}-${mm}-${dd}`;
      }
      this.paymentForm.get('paymentDate')?.setValue(getDateFormat(this.paymentForm.get('paymentDate')?.value));
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
            this.alert.Toast.fire((error.error)?error.error:((error.message)?error.message:'Something went wrong'),'','error');
            console.error(error);
          }
        });
      }
      else if (this.modalMode === 'add') {
        console.log(this.paymentForm.value);
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
              this.alert.Toast.fire((error.error)?error.error:((error.message)?error.message:'Something went wrong'),'','error');
            console.error(error);
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
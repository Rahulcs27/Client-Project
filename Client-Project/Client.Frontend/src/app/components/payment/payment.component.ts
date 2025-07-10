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
import { CompanyMasterServiceService } from '../../services/company-master-service.service';
import { ProductService } from '../../services/product.service';
import { ProductGetDto } from '../product/product-dtos';
import { SubContractorGetDto } from '../sub-contractor/sub-contractor-dtos';
import { SubContractorService } from '../../services/sub-contractor.service';
import { CompanyMasterGetDto } from '../company-master/company-master-dtos';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-payment',
  imports: [CommonModule,ReactiveFormsModule,TableComponent],
  templateUrl: './payment.component.html',
  styleUrl: '../../../componentStyle.css'
})
export class PaymentComponent {
  constructor(
    private loginService: LoginService,
    private paymentService: PaymentService,
    private invoiceService: InvoiceService,
    private companyService: CompanyMasterServiceService,
    private productService: ProductService,
    private subContractorService: SubContractorService,
    private alert: AlertService
  ) { }
  modalMode: 'edit' | 'add' = 'edit';
  invoices :InvoiceGetDto[] = [];
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
      invoiceId: new FormControl('', [Validators.required,]),
      paymentDate: new FormControl('', [Validators.required, Validators.maxLength(50),]),
      amountPaid: new FormControl('', [Validators.required,]),
      paymentMode: new FormControl('', [Validators.required, Validators.maxLength(50),]),
      bankName: new FormControl('', [Validators.maxLength(50),]),
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
    this.invoiceService.getAllInvoiceGetDto().subscribe({
      next: (response: InvoiceGetDto[])=>{
        this.invoices = response
      },
      error: (error)=>{
        console.log(error);
      }
    })
    this.productService.getAllProductGetDto().subscribe({
      next: (response: ProductGetDto[])=>{
        this.products = response
      },
      error: (error)=>{
        console.log(error);
      }
    })
    this.companyService.getAllCompanyMasterGetDto().subscribe({
      next: (response: CompanyMasterGetDto[])=>{
        this.companies = response
      },
      error: (error)=>{
        console.log(error);
      }
    })
    this.subContractorService.getAllSubContractorGetDto().subscribe({
      next: (response: SubContractorGetDto[])=>{
        this.subContractors = response
      },
      error: (error)=>{
        console.log(error);
      }
    })
    this.getAllPaymentGetDto()
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
        'templateRef': this.checkViewer() ? null : this.actionTemplateRef
      }
    }

  }

  checkViewer = (): boolean => this.loginService.role() !== null && this.loginService.role() === 'Viewer';

  closeModal() {
    this.paymentForm.reset({
      id: '',
      invoiceId: '',
      paymentDate: '',
      amountPaid: '',
      paymentMode: '',
      bankName: '',
      paymentStatus: '',
      createdBy: '',
      updatedBy: '',
    })
    this.modalMode = 'edit';
  }

  closeInvoiceModal(){
    this.invoiceForm.reset({
      companyId: '',
      subcontractorId: '',
      productId: '',
      invoiceDate: '',
      status: '',
      quantity: '',
      totalAmount: '',
      paymentMode: '',
    })
  }

  getAllPaymentGetDto() {
    this.paymentService.getAllPaymentGetDto().subscribe({
      next: (response: PaymentGetDto[]) => {
        this.data = response;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  addPaymentGetDto() {
    this.paymentForm.get('invoiceId')?.setValue('');
    this.modalMode = 'add';
  }

  editPaymentGetDto(obj: PaymentGetDto) {
    this.paymentForm.patchValue({
      id: obj.r_id,
      invoiceId: obj.r_invoiceId,
      paymentDate: obj.r_paymentDate.split('T')[0],
      amountPaid: obj.r_amountPaid,
      paymentMode: obj.r_paymentMode,
      bankName: obj.r_bankName,
      paymentStatus: obj.r_paymentStatus,
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

  invoiceGetDto(invoiceId: number){
    const invoice = this.invoices.find(i => i.r_id === invoiceId);
    this.invoiceForm.patchValue({
      companyId: invoice?.r_companyId,
      subcontractorId: invoice?.r_subcontractorId,
      productId: invoice?.r_productId,
      invoiceDate: invoice?.r_invoiceDate.split('T')[0],
      status: invoice?.r_status,
      quantity: invoice?.r_quantity,
      totalAmount: invoice?.r_totalAmount,
      paymentMode: invoice?.r_paymentMode,
    })
    this.invoiceForm.get('companyId')?.disable();
    this.invoiceForm.get('subcontractorId')?.disable();
    this.invoiceForm.get('productId')?.disable();
    this.invoiceForm.get('invoiceDate')?.disable();
    this.invoiceForm.get('status')?.disable();
    this.invoiceForm.get('quantity')?.disable();
    this.invoiceForm.get('totalAmount')?.disable();
    this.invoiceForm.get('paymentMode')?.disable();
  }

  savePaymentGetDto() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      console.log('Payment form invalid', this.paymentForm.value);
    }
    else {
      if (this.modalMode === 'edit') {
        this.paymentService.editPaymentUpdateDto(this.paymentForm.value).subscribe({
          next: (response: PaymentGetDto[]) => {
            this.data = response;
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
        this.paymentForm.get('createdBy')?.setValue(1);
        this.paymentService.addPaymentGetDto(this.paymentForm.value).subscribe(
          {
            next: (response: PaymentGetDto[]) => {
              this.data = response
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
declare var bootstrap: any;
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TableComponent } from "../utils/table/table.component";
import { InvoiceService } from '../../services/invoice.service';
import { AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InvoiceGetDto } from './invoice-dtos';
import { ProductGetDto } from '../product/product-dtos';
import { CompanyMasterServiceService } from '../../services/company-master-service.service';
import { ProductService } from '../../services/product.service';
import { SubContractorGetDto } from '../sub-contractor/sub-contractor-dtos';
import { SubContractorService } from '../../services/sub-contractor.service';
import { CompanyMasterGetDto } from '../company-master/company-master-dtos';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-invoice',
  imports: [TableComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './invoice.component.html',
  styleUrl: '../../../componentStyle.css',
})
export class InvoiceComponent {
  constructor(
    private loginService: LoginService,
    private invoiceService: InvoiceService,
    private companyService: CompanyMasterServiceService,
    private productService: ProductService,
    private subContractorService: SubContractorService,
    private alert: AlertService
  ) { }
  modalMode: 'view' | 'edit' | 'add' = 'view';
  displayedColumns: string[] = [
    // 'r_id', 'r_companyName', 
    'r_subcontractorName',
    // 'r_productDescription', 
    'r_invoiceDate', 'r_status', 'r_quantity', 'r_totalAmount',
    // 'r_paymentMode', 
    'action'];
  data: InvoiceGetDto[] = [];
  companies: CompanyMasterGetDto[] = [];
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
      // unitPrice: new FormControl('', [Validators.required]),
      status: new FormControl(''),
      quantity: new FormControl('', [Validators.required]),
      totalAmount: new FormControl('', [Validators.required]),
      paymentMode: new FormControl('', [Validators.required]),
      createdBy: new FormControl(''),
      updatedBy: new FormControl(''),
    }
  );

  ngOnInit(): void {
    this.invoiceForm.get('totalAmount')?.disable();
    const companyId = this.loginService.companyId();
    if(companyId) {
      this.companyService.getAllCompanyMasterGetDto().subscribe({
        next: (response: CompanyMasterGetDto[]) => {
          this.companies = response;
        },
        error: (error) => {
          console.log(error);
  
        }
      })
      this.productService.getAllProductGetDto(companyId).subscribe({
        next: (response: ProductGetDto[]) => {
          this.products = response
        },
        error: (error) => {
          console.log(error);
        }
      })
      this.subContractorService.getAllSubContractorGetDto(companyId).subscribe({
        next: (response: SubContractorGetDto[]) => {
          this.subContractors = response
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
    this.getAllInvoiceGetDto()
    this.columnsInfo = {
      // 'r_id': {
      //   'title': 'Invoice No.',
      //   'isSort': true,
      //   'templateRef': null
      // },
      // 'r_companyName': {
      //   'title': 'Company Name',
      //   'isSort': true,
      //   'templateRef': null
      // },
      'r_subcontractorName': {
        'title': 'Sub-Contract Name',
        'isSort': true,
        'templateRef': null
      },
      // 'r_productDescription': {
      //   'title': 'Product Name',
      //   'isSort': true,
      //   'templateRef': null
      // },
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
        'title': 'Total Amout',
        'isSort': true,
        'templateRef': null
      },
      // 'r_paymentMode': {
      //   'title': 'Payment Mode',
      //   'isSort': true,
      //   'templateRef': null
      // },
      'action': {
        'title': 'Action',
        'templateRef': this.checkViewer() ? null : this.actionTemplateRef
      }
    }

  }
  checkViewer = (): boolean => this.loginService.role() !== null && this.loginService.role() === 'Viewer';
  getAllInvoiceGetDto() {
    this.invoiceService.getAllInvoiceGetDto().subscribe({
      next: (response: InvoiceGetDto[]) => {
        this.data = response;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  calculateTotalAmount(){
    const productId = Number(this.invoiceForm.get('productId')?.value)
    if(productId && productId > 0){
      const product = this.products.find(p => p.r_id === productId)
      const quantity = Number(this.invoiceForm.get('quantity')?.value)
      if(product && quantity && quantity > 0){
        this.invoiceForm.get('totalAmount')?.setValue(product.r_unitPrice * quantity)
      }
    }
  }

  closeModal() {
    this.invoiceForm.reset({
      id: '',
      companyId: '',
      subcontractorId: '',
      productId: '',
      invoiceDate: '',
      quantity: '',
      totalAmount: '',
      paymentMode: '',
      status: '',
      createdBy: '',
      updatedBy: '',
    })
    this.modalMode = 'view';
  }

  viewAndEditInvoiceGetDto(obj: InvoiceGetDto, mode: 'view'|'edit') {
    this.invoiceForm.patchValue({
      id: obj.r_id,
      companyId: obj.r_companyId,
      subcontractorId: obj.r_subcontractorId,
      productId: obj.r_productId,
      invoiceDate: obj.r_invoiceDate.split('T')[0],
      status: obj.r_status,
      quantity: obj.r_quantity,
      totalAmount: obj.r_totalAmount,
      paymentMode: obj.r_paymentMode,
      updatedBy: (mode === 'edit') && this.loginService.userId(),
    })
    if(mode === 'view'){
      this.invoiceForm.disable();
    }
    else{
      this.invoiceForm.enable();
      this.invoiceForm.get('totalAmount')?.disable();
    }
    this.modalMode = mode;
  }

  addInvoiceGetDto() {
    this.invoiceForm.patchValue({
      companyId: this.loginService.companyId(),
      subcontractorId: '',
      createdBy: this.loginService.userId(),
    })
    this.modalMode = 'add';
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

  saveInvoiceGetDto() {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      console.log('Invoice form invalid', this.invoiceForm.value);
    }
    else {
      if (this.modalMode === 'edit') {
        const formData = this.invoiceForm.value;
        formData['totalAmount'] = this.invoiceForm.get('totalAmount')?.value
        this.invoiceService.editInvoiceUpdateDto(formData).subscribe({
          next: (response: InvoiceGetDto) => {
            this.data = this.data.map(d => {
              if (d.r_id === response.r_id) {
                d.r_companyId = response.r_companyId;
                d.r_companyName = response.r_companyName;
                d.r_productId = response.r_productId;
                d.r_productDescription = response.r_productDescription
                d.r_subcontractorId = response.r_subcontractorId;
                d.r_subcontractorName = response.r_subcontractorName;
                d.r_invoiceDate = response.r_invoiceDate;
                d.r_paymentMode = response.r_paymentMode;
                d.r_quantity = response.r_quantity;
                d.r_status = response.r_status;
                d.r_totalAmount = response.r_totalAmount;
                return d
              }
              else {
                return d;
              }
            })
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
        this.invoiceService.addInvoiceGetDto(this.invoiceForm.value).subscribe(
          {
            next: (response: InvoiceGetDto) => {
              this.data = [response, ...this.data];
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

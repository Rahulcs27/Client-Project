declare var bootstrap: any;
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TableComponent } from "../utils/table/table.component";
import { InvoiceService } from '../../services/invoice.service';
import { AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InvoiceGetDto } from './Modals/invoice-get-dto';
import { CompanyMasterGetDto } from '../company-master/Modals/company-master-get-dto';
import { ProductGetDto } from '../product/Modals/product-get-dto';
import { CompanyMasterServiceService } from '../../services/company-master-service.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-invoice',
  imports: [TableComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent {
  constructor(private invoiceService: InvoiceService,
    private companyService: CompanyMasterServiceService,
    private productService: ProductService,
    private alert: AlertService
  ) { }
  modalMode: 'view' | 'edit' | 'add' = 'view';
  displayedColumns: string[] = ['r_companyName', 'r_subcontractorName', 'r_productDescription', 'r_invoiceDate', 'r_status', 'r_quantity', 'r_totalAmount', 'r_paymentMode', 'action'];
  data: InvoiceGetDto[] = [];
  companies: CompanyMasterGetDto[] = [];
  products: ProductGetDto[] = [];
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
      status: new FormControl(''),
      quantity: new FormControl('', [Validators.required]),
      totalAmount: new FormControl('', [Validators.required]),
      paymentMode: new FormControl('', [Validators.required]),
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
    this.productService.getAllProductGetDto().subscribe({
      next: (response: ProductGetDto[]) => {
        this.products = response
      },
      error: (error) => {
        console.log(error);
      }
    })
    this.getAllInvoiceGetDto()
    this.columnsInfo = {
      'r_companyName': {
        'title': 'Company Name',
        'isSort': true,
        'templateRef': null
      },
      'r_subcontractorName': {
        'title': 'Sub-Contract Name',
        'isSort': true,
        'templateRef': null
      },
      'r_productDescription': {
        'title': 'Product Name',
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
        'title': 'Total Amout',
        'isSort': true,
        'templateRef': null
      },
      'r_paymentMode': {
        'title': 'Payment Mode',
        'isSort': true,
        'templateRef': null
      },
      'action': {
        'title': 'Action',
        'templateRef': this.actionTemplateRef
      }
    }

  }

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
      createdBy: '',
      updatedBy: '',
    })
    this.invoiceForm.get('companyId')?.enable();
    this.invoiceForm.get('subcontractorId')?.enable();
    this.invoiceForm.get('productId')?.enable();
    this.invoiceForm.get('invoiceDate')?.enable();
    this.invoiceForm.get('quantity')?.enable();
    this.invoiceForm.get('totalAmount')?.enable();
    this.invoiceForm.get('paymentMode')?.enable();
    this.modalMode = 'view';
  }

  viewInvoiceGetDto(obj: InvoiceGetDto) {
    this.invoiceForm.patchValue({
      companyId: obj.r_companyId,
      subcontractorId: obj.r_subcontractorId,
      productId: obj.r_productId,
      invoiceDate: obj.r_invoiceDate,
      quantity: obj.r_quantity,
      totalAmount: obj.r_totalAmount,
      paymentMode: obj.r_paymentMode,
    })
    this.invoiceForm.get('companyId')?.disable();
    this.invoiceForm.get('subcontractorId')?.disable();
    this.invoiceForm.get('productId')?.disable();
    this.invoiceForm.get('invoiceDate')?.disable();
    this.invoiceForm.get('quantity')?.disable();
    this.invoiceForm.get('totalAmount')?.disable();
    this.invoiceForm.get('paymentMode')?.disable();
    this.modalMode = 'view';
  }

  editInvoiceGetDto(obj: InvoiceGetDto) {
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
      updatedBy: 1,
    })
    this.modalMode = 'edit';
  }

  addInvoiceGetDto() {
    this.invoiceForm.patchValue({
      createdBy: 1
    })
    this.modalMode = 'add';
  }

  saveInvoiceGetDto() {
    if(this.invoiceForm.invalid){
      this.invoiceForm.markAllAsTouched();
      console.log('Invoice form invalid', this.invoiceForm.value);
    }
    else{
      console.log(this.invoiceForm.get('subcontractorId')?.value);
      if (this.modalMode === 'edit') {
        this.invoiceService.editInvoiceUpdateDto(this.invoiceForm.value).subscribe({
          next: (response: InvoiceGetDto) => {
            this.data = this.data.map(d => {
              if(d.r_id === response.r_id){
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
              else{
                return d;
              }
            })
            this.alert.Toast.fire('Updated Successfully','','success')
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
              this.data = [response,...this.data];
              this.alert.Toast.fire('Added Successfully','','success')
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

import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TableComponent } from "../utils/table/table.component";
import { InvoiceService } from '../../services/invoice.service';
import { AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InvoiceGetDto } from './Modals/invoice-get-dto';

@Component({
  selector: 'app-invoice',
  imports: [TableComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent {
  constructor(private invoiceService: InvoiceService,
    private alert: AlertService
  ) { }
  modalMode: 'view' | 'edit' | 'add' = 'view';
  displayedColumns: string[] = ['r_companyName', 'r_subcontractorName', 'r_productName', 'r_invoiceDate', 'r_status', 'r_quantity', 'r_totalAmount', 'r_paymentMode', 'action'];
  data: InvoiceGetDto[] = [];
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
      quantity: new FormControl('', [Validators.required]),
      totalAmount: new FormControl('', [Validators.required]),
      paymentMode: new FormControl('', [Validators.required]),
      createdBy: new FormControl(''),
      updatedBy: new FormControl(''),
    }
  );

  ngOnInit(): void {
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
      'r_productName': {
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
      invoiceDate: obj.r_invoiceDate,
      quantity: obj.r_quantity,
      totalAmount: obj.r_totalAmount,
      paymentMode: obj.r_paymentMode,
    })
    this.modalMode = 'edit';
  }

  // addCompanyMasterGetDto() {
  //   this.companyMasterForm.patchValue({
  //     createdBy: 1
  //   })
  //   this.modalMode = 'add';
  // }

  // saveCompanyMasterGetDto() {
  //   if(this.companyMasterForm.invalid){
  //     this.companyMasterForm.markAllAsTouched();
  //     console.log('company master form invalid', this.companyMasterForm.value);
  //   }
  //   else{
  //     if (this.modalMode === 'edit') {
  //       this.companyMasterService.editCompanyMasterUpdateDto(this.companyMasterForm.value).subscribe({
  //         next: (response: CompanyMasterGetDto) => {
  //           this.data = this.data.map(d => {
  //             if(d.id === response.id){
  //               d.name = response.name;
  //               d.phone = response.phone;
  //               d.email = response.email;
  //               d.address = response.address;
  //               return d
  //             }
  //             else{
  //               return d;
  //             }
  //           })
  //           this.alert.Toast.fire('Updated Successfully','','success')
  //           const modalElement = document.getElementById('companyMaster-modal');
  //           if (modalElement) {
  //             const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
  //             modalInstance.hide();
  //           }
  //         },
  //         error: (error) => {
  //           console.log(error);
  //         }
  //       });
  //     }
  //     else if (this.modalMode === 'add') {
  //       this.companyMasterService.addCompanyMasterGetDto(this.companyMasterForm.value).subscribe(
  //         {
  //           next: (response: CompanyMasterGetDto) => {
  //             this.data = [response,...this.data];
  //             this.alert.Toast.fire('Added Successfully','','success')
  //           },
  //           error: (error) => {
  //             console.log(error);
  //           }
  //         }
  //       );
  //     }
  //   }
  // }
}

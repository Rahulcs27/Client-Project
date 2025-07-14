declare var bootstrap: any;
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { ProductGetDto } from './product-dtos';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { TableComponent } from "../utils/table/table.component";
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { ExportFileService } from '../../services/export-file.service';

@Component({
  selector: 'app-product',
  imports: [TableComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrl: '../../../componentStyle.css'
})
export class ProductComponent {
  userId: number | null = null;
  companyId: number | null = null;
  constructor(
    private exportService: ExportFileService,
    private loginService: LoginService,
    private productService: ProductService,
    private alert: AlertService
  ) { }
  searchVaue: string = '';
  modalMode: 'view' | 'edit' | 'add' = 'view';
  displayedColumns: string[] = ['r_description', 'r_unitPrice', 'action'];
  data: ProductGetDto[] = [];
  fullData: ProductGetDto[] = [];
  columnsInfo: {
    [key: string]: {
      'title'?: string,
      'isSort'?: boolean,
      'templateRef': TemplateRef<any> | null,
    }
  } = {};
  @ViewChild('actionTemplateRef', { static: true }) actionTemplateRef!: TemplateRef<any>;

  productForm: FormGroup = new FormGroup(
    {
      id: new FormControl(''),
      companyId: new FormControl('', [Validators.required,]),
      description: new FormControl('', [Validators.required, Validators.maxLength(50),]),
      unitPrice: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$'),]),
      createdBy: new FormControl(''),
      updatedBy: new FormControl(''),
    }
  );

  ngOnInit(): void {
    this.userId = this.loginService.userId();
    this.companyId = this.loginService.companyId();
    if (this.userId && this.companyId) {
      this.productService.getAllProductGetDto(this.companyId).subscribe({
        next: (response: ProductGetDto[]) => {
          this.fullData = response;
          this.data = response;
        },
        error: (error) => {
          console.log(error);
        }
      });
      this.columnsInfo = {
        'r_description': {
          'title': 'Name',
          'isSort': true,
          'templateRef': null
        },
        'r_unitPrice': {
          'title': 'Unit Price',
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
    this.exportService.printToPDF('table', 'productMaster.pdf', [
      'Name',
      'Unit Price',
    ])
  }

  exportToExcel() {
    this.exportService.printToExcel('table', 'productMaster.xlsx', [
      'Name',
      'Unit Price',
    ])
  }

  setSearchValue(value: string) {
    this.searchVaue = value;
  }

  onSearch() {
    this.data = this.fullData.filter(d => d.r_description.includes(this.searchVaue));
  }

  closeModal() {
    this.productForm.reset({
      id: '',
      companyId: '',
      description: '',
      unitPrice: '',
      CreatedBy: '',
      UpdatedBy: '',
    })
    this.modalMode = 'view';
  }

  addProductGetDto() {
    this.productForm.patchValue({
      companyId: this.companyId,
      createdBy: this.userId,
    })
    this.productForm.enable();
    this.modalMode = 'add';
  }

  viewAndEditProductGetDto(obj: ProductGetDto, mode: 'view' | 'edit') {
    this.productForm.patchValue({
      id: obj.r_id,
      companyId: obj.r_companyID,
      description: obj.r_description,
      unitPrice: obj.r_unitPrice,
      updatedBy: this.userId,
    })
    if (mode === 'view') {
      this.productForm.disable();
    }
    else {
      this.productForm.enable();
    }
    this.modalMode = mode;
  }

  deleteRowData(id: number) {
    this.alert.Delete.fire().then((result) => {
      if (result.isConfirmed && this.userId && this.companyId) {
        this.productService.deleteProductGetDto(id, this.userId, this.companyId).subscribe({
          next: (response: ProductGetDto[]) => {
            this.fullData = response;
            this.onSearch();
            this.alert.Toast.fire('Deleted Successfully', '', 'success');
          },
          error: (error) => {
            console.log(error);
          }
        })
      }
    });
  }

  saveProductGetDto() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      console.log('product form invalid', this.productForm.value);
    }
    else {
      if (this.modalMode === 'edit') {
        this.productService.editProductUpdateDto(this.productForm.value).subscribe({
          next: (response: ProductGetDto[]) => {
            this.fullData = response;
            this.onSearch();
            this.alert.Toast.fire('Updated Successfully', '', 'success');
            this.closeModal();
            const modalElement = document.getElementById('product-modal');
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
        this.productService.addProductGetDto(this.productForm.value).subscribe(
          {
            next: (response: ProductGetDto[]) => {
              this.fullData = response;
              this.onSearch();
              this.alert.Toast.fire('Added Successfully', '', 'success');
              this.closeModal();
              const modalElement = document.getElementById('product-modal');
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

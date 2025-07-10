declare var bootstrap: any;
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { ProductGetDto } from './product-dtos';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { TableComponent } from "../utils/table/table.component";
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-product',
  imports: [TableComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrl: '../../../componentStyle.css'
})
export class ProductComponent {
  constructor(
    private loginService: LoginService,
    private productService: ProductService,
    private alert: AlertService
  ) { }
  modalMode: 'edit' | 'add' = 'edit';
  displayedColumns: string[] = ['r_description', 'r_unitPrice', 'action'];
  data: ProductGetDto[] = [];
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
      description: new FormControl('', [Validators.required, Validators.maxLength(50),]),
      unitPrice: new FormControl('', [Validators.required,]),
      createdBy: new FormControl(''),
      updatedBy: new FormControl(''),
    }
  );

  ngOnInit(): void {
    this.getAllProductGetDto()
    this.columnsInfo = {
      'r_description': {
        'title': 'Description',
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
        'templateRef': this.checkViewer() ? null : this.actionTemplateRef
      }
    }

  }

  checkViewer = (): boolean => this.loginService.role() !== null && this.loginService.role() === 'Viewer';

  closeModal() {
    this.productForm.reset({
      id: '',
      description: '',
      unitPrice: '',
      CreatedBy: '',
      UpdatedBy: '',
    })
    this.modalMode = 'edit';
  }

  getAllProductGetDto() {
    this.productService.getAllProductGetDto().subscribe({
      next: (response: ProductGetDto[]) => {
        this.data = response;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  addProductGetDto() {
    this.modalMode = 'add';
  }

  editProductGetDto(obj: ProductGetDto) {
    this.productForm.patchValue({
      id: obj.r_id,
      description: obj.r_description,
      unitPrice: obj.r_unitPrice,
      updatedBy: 1,
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

  saveProductGetDto() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      console.log('product form invalid', this.productForm.value);
    }
    else {
      if (this.modalMode === 'edit') {
        this.productService.editProductUpdateDto(this.productForm.value).subscribe({
          next: (response: ProductGetDto) => {
            this.data = this.data.map(d => {
              if (d.r_id === response.r_id) {
                d.r_description = response.r_description;
                d.r_unitPrice = response.r_unitPrice;
                return d
              }
              else {
                return d;
              }
            })
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
        this.productForm.get('createdBy')?.setValue(1);
        this.productService.addProductGetDto(this.productForm.value).subscribe(
          {
            next: (response: ProductGetDto) => {
              this.data = [response, ...this.data];
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

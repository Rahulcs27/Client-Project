declare var bootstrap: any;
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { ProductGetDto } from './Modals/product-get-dto';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { TableComponent } from "../utils/table/table.component";
import { CommonModule } from '@angular/common';
import { ProductUpdateDto } from './Modals/product-update-dto';
import { ProductCreateDto } from './Modals/product-create-dto';

@Component({
  selector: 'app-product',
  imports: [TableComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  constructor(private productService: ProductService,
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
      R_id: new FormControl(''),
      R_description: new FormControl('', [Validators.required, Validators.maxLength(50),]),
      R_unitPrice: new FormControl('', [Validators.required,]),
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
        'templateRef': this.actionTemplateRef
      }
    }

  }

  closeModal() {
    this.productForm.reset({
      R_id: '',
      R_description: '',
      R_unitPrice: '',
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

  addProductGetDto(){
    this.modalMode = 'add';
  }

  editProductGetDto(obj: ProductGetDto){
    this.productForm.patchValue({
      R_id: obj.r_id,
      R_description: obj.r_description,
      R_unitPrice: obj.r_unitPrice,
    })
    this.modalMode = 'edit';
  }

  saveProductGetDto() {
      if(this.productForm.invalid){
        this.productForm.markAllAsTouched();
        console.log('product form invalid', this.productForm.value);
      }
      else{
        if (this.modalMode === 'edit') {
          const formData = new ProductUpdateDto();
          formData.Id = this.productForm.get('R_id')?.value;
          formData.Description = this.productForm.get('R_description')?.value;
          formData.UnitPrice = this.productForm.get('R_unitPrice')?.value;
          formData.UpdatedBy = 1
          this.productService.editProductUpdateDto(formData).subscribe({
            next: (response: ProductGetDto) => {
              this.data = this.data.map(d => {
                if(d.r_id === response.r_id){
                  d.r_description = response.r_description;
                  d.r_unitPrice = response.r_unitPrice;
                  return d
                }
                else{
                  return d;
                }
              })
              this.alert.Toast.fire('Updated Successfully','','success');
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
          const formData = new ProductCreateDto();
          formData.Description = this.productForm.get('R_description')?.value;
          formData.UnitPrice = Number(this.productForm.get('R_unitPrice')?.value);
          formData.CreatedBy = 1
          this.productService.addProductGetDto(formData).subscribe(
            {
              next: (response: ProductGetDto) => {
                this.data = [response,...this.data];
                this.alert.Toast.fire('Added Successfully','','success');
                this.closeModal();
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

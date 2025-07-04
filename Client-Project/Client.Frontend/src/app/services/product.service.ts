import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../constant';
import { ProductGetDto } from '../components/product/Modals/product-get-dto';
import { ProductCreateDto } from '../components/product/Modals/product-create-dto';
import { ProductUpdateDto } from '../components/product/Modals/product-update-dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  getAllProductGetDto(): Observable<ProductGetDto[]> {
    return this.http.get<ProductGetDto[]>(`${apiUrl}/Product`);
  }

  editProductUpdateDto(formData: ProductUpdateDto): Observable<ProductGetDto> {
    return this.http.put<ProductGetDto>(`${apiUrl}/Product/update`, formData);
  }

  addProductGetDto(formData: ProductCreateDto): Observable<ProductGetDto> {
    return this.http.post<ProductGetDto>(`${apiUrl}/Product/create`, formData);
  }
}

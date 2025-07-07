import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../constant';
import { ProductCreateDto, ProductGetDto, ProductUpdateDto } from '../components/product/product-dtos';

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

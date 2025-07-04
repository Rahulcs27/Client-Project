import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../constant';
import { InvoiceGetDto } from '../components/invoice/Modals/invoice-get-dto';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  constructor(private http: HttpClient) { }

  getAllInvoiceGetDto(): Observable<InvoiceGetDto[]> {
    return this.http.get<InvoiceGetDto[]>(`${apiUrl}/Invoice`);
  }

  // editCompanyMasterUpdateDto(formData: CompanyMasterUpdateDto): Observable<CompanyMasterGetDto> {
  //   return this.http.put<CompanyMasterGetDto>(`${apiUrl}/Company/update`, formData);
  // }

  // addCompanyMasterGetDto(formData: CompanyMasterCreateDto): Observable<CompanyMasterGetDto> {
  //   return this.http.post<CompanyMasterGetDto>(`${apiUrl}/Company/create`, formData);
  // }
}

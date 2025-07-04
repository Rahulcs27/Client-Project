import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../constant';
import { InvoiceGetDto } from '../components/invoice/Modals/invoice-get-dto';
import { InvoiceUpdateDto } from '../components/invoice/Modals/invoice-update-dto';
import { InvoiceCreateDto } from '../components/invoice/Modals/invoice-create-dto';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  constructor(private http: HttpClient) { }

  getAllInvoiceGetDto(): Observable<InvoiceGetDto[]> {
    return this.http.get<InvoiceGetDto[]>(`${apiUrl}/Invoice`);
  }

  editInvoiceUpdateDto(formData: InvoiceUpdateDto): Observable<InvoiceGetDto> {
    return this.http.put<InvoiceGetDto>(`${apiUrl}/Invoice/update`, formData);
  }

  addInvoiceGetDto(formData: InvoiceCreateDto): Observable<InvoiceGetDto> {
    return this.http.post<InvoiceGetDto>(`${apiUrl}/Invoice/create`, formData);
  }
}

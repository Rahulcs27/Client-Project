import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompanyMasterGetDto } from '../components/company-master/Modals/company-master-get-dto';
import { apiUrl } from '../../constant';
import { Observable } from 'rxjs';
import { CompanyMasterUpdateDto } from '../components/company-master/Modals/company-master-update-dto';
import { CompanyMasterCreateDto } from '../components/company-master/Modals/company-master-create-dto';

@Injectable({
  providedIn: 'root'
})
export class CompanyMasterServiceService {
  constructor(private http: HttpClient) { }

  getAllCompanyMasterGetDto(): Observable<CompanyMasterGetDto[]> {
    return this.http.get<CompanyMasterGetDto[]>(`${apiUrl}/Company`);
  }

  editCompanyMasterUpdateDto(formData:CompanyMasterUpdateDto): Observable<CompanyMasterGetDto> {
    return this.http.put<CompanyMasterGetDto>(`${apiUrl}/Company/update`,formData);
  }

  addCompanyMasterGetDto(formData:CompanyMasterCreateDto): Observable<CompanyMasterGetDto> {
    return this.http.post<CompanyMasterGetDto>(`${apiUrl}/Company/create`,formData);
  }
}

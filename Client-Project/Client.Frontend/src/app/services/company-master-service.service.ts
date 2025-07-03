import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompanyMasterGetDto } from '../components/company-master/Modals/company-master-get-dto';
import { apiUrl } from '../../constant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyMasterServiceService {
private apiUrl=`${apiUrl}`;

  constructor(private http:HttpClient) { }

  getAllCompanyMasterGetDto():Observable<CompanyMasterGetDto[]> {
    return this.http.get<CompanyMasterGetDto[]>(`${this.apiUrl}/Company`);
  }
}

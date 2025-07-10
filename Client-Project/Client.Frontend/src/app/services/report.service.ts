import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../constant';
import { PaidReportDto } from '../components/paid-reports/paid-report-dto';
import { UnpaidReportDto } from '../components/unpaid-reports/unpaid-report-dto';
import { ProductWiseReportComponent } from '../components/product-wise-report/product-wise-report.component';
import { SubContractorWiseReportDto } from '../components/sub-contractor-wise-report/sub-contractor-wise-report-dto';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private http: HttpClient) { }

  getAllPaidReportsGetDto(): Observable<PaidReportDto[]> {
    return this.http.get<PaidReportDto[]>(`${apiUrl}/Report/paid-report`);
  }
   getAllUnPaidReportsGetDto(): Observable<UnpaidReportDto[]> {
    return this.http.get<UnpaidReportDto[]>(`${apiUrl}/Report/unpaid-report`);
  }
  getAllProductWiseReportsGetDto(): Observable<ProductWiseReportComponent[]> {
    return this.http.get<ProductWiseReportComponent[]>(`${apiUrl}/Report/product-wise-report`);
  }
  getAllSubContractorWiseReportsGetDto(): Observable<SubContractorWiseReportDto[]> {
    return this.http.get<SubContractorWiseReportDto[]>(`${apiUrl}/Report/subcontractor-wise-report`);
  }
}

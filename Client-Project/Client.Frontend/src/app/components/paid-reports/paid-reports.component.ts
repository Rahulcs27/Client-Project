import { Component, OnInit, TemplateRef } from '@angular/core';
import { TableComponent } from '../utils/table/table.component';
import { ReportService } from '../../services/report.service';
import { PaidReportDto } from './paid-report-dto';

@Component({
  selector: 'app-paid-reports',
  imports: [TableComponent],
  templateUrl: './paid-reports.component.html',
  styleUrl: '../../../componentStyle.css'
})
export class PaidReportsComponent implements OnInit {
  data: PaidReportDto[] = []
  displayedColumns = [
    'paymentMode',
    'noOfInvoice',
    'totalAmount',
    'paidAmount',
  ]
  columnsInfo: {
    [key: string]: {
      'title'?: string,
      'isSort'?: boolean,
      'templateRef': TemplateRef<any> | null,
    }
  } = {};
  constructor(private reportService: ReportService) { }
  ngOnInit(): void {
    this.reportService.getAllPaidReportsGetDto().subscribe({
      next: (response: PaidReportDto[]) => {
        this.data = response;
      },
      error: (error) => {
        console.log(error);
      }
    })
    this.columnsInfo = {
      'paymentMode': {
        'title': 'Payment Mode',
        'isSort': true,
        'templateRef': null
      },
      'noOfInvoice': {
        'title': 'No. of Invoice',
        'isSort': true,
        'templateRef': null
      },
      'totalAmount': {
        'title': 'Total Amount',
        'isSort': true,
        'templateRef': null
      },
      'paidAmount': {
        'title': 'Paid Amount',
        'isSort': true,
        'templateRef': null
      }
    }
  }
}

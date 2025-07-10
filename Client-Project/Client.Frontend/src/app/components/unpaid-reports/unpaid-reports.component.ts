import { Component, TemplateRef } from '@angular/core';
import { TableComponent } from "../utils/table/table.component";
import { ReportService } from '../../services/report.service';
import { UnpaidReportDto } from './unpaid-report-dto';

@Component({
  selector: 'app-unpaid-reports',
  imports: [TableComponent],
  templateUrl: './unpaid-reports.component.html',
  styleUrl: '../../../componentStyle.css'
})
export class UnpaidReportsComponent {
  data: UnpaidReportDto[] = []
  displayedColumns = [
    'paymentMode',
    'noOfInvoice',
    'totalAmount',
    'unPaidAmount',
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
    this.reportService.getAllUnPaidReportsGetDto().subscribe({
      next: (response: UnpaidReportDto[]) => {
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
      'unPaidAmount': {
        'title': 'Unpaid Amount',
        'isSort': true,
        'templateRef': null
      }
    }
  }
}

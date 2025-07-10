import { Component, TemplateRef } from '@angular/core';
import { TableComponent } from "../utils/table/table.component";
import { SubContractorWiseReportDto } from './sub-contractor-wise-report-dto';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-sub-contractor-wise-report',
  imports: [TableComponent],
  templateUrl: './sub-contractor-wise-report.component.html',
  styleUrl: '../../../componentStyle.css'
})
export class SubContractorWiseReportComponent {
  data: SubContractorWiseReportDto[] = []
  displayedColumns = [
    "subCoName",
    "noOfInvoice",
    "monthYear",
    "totalAmount",
    "cashAmount",
    "balanceAmount",
    "paidAmount",
    "unPaidAmount",
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
    this.reportService.getAllSubContractorWiseReportsGetDto().subscribe({
      next: (response: SubContractorWiseReportDto[]) => {
        this.data = response;
      },
      error: (error) => {
        console.log(error);
      }
    })
    this.columnsInfo = {
      'subCoName': {
        'title': 'SubContractor Name',
        'isSort': true,
        'templateRef': null
      },
      'noOfInvoice': {
        'title': 'No. of Invoice',
        'isSort': true,
        'templateRef': null
      },
      'monthYear': {
        'title': 'Month-Year',
        'isSort': true,
        'templateRef': null
      },
      'totalAmount': {
        'title': 'Total Amount',
        'isSort': true,
        'templateRef': null
      },
      'cashAmount': {
        'title': 'Cash Amount',
        'isSort': true,
        'templateRef': null
      },
      "balanceAmount": {
        'title': 'Balance Amount',
        'isSort': true,
        'templateRef': null
      },
      "paidAmount": {
        'title': 'Paid Amount',
        'isSort': true,
        'templateRef': null
      },
      "unPaidAmount": {
        'title': 'UnPaid Amount',
        'isSort': true,
        'templateRef': null
      },
    }
  }
}

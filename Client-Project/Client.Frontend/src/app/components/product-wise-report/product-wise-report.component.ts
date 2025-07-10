import { Component, TemplateRef } from '@angular/core';
import { TableComponent } from "../utils/table/table.component";
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-product-wise-report',
  imports: [TableComponent],
  templateUrl: './product-wise-report.component.html',
  styleUrl: '../../../componentStyle.css'
})
export class ProductWiseReportComponent {
  data: ProductWiseReportComponent[] = []
  displayedColumns = [
    "prodName",
    "noOfInvoices",
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
    this.reportService.getAllProductWiseReportsGetDto().subscribe({
      next: (response: ProductWiseReportComponent[]) => {
        this.data = response;
      },
      error: (error) => {
        console.log(error);
      }
    })
    this.columnsInfo = {
      'prodName': {
        'title': 'Product Name',
        'isSort': false,
        'templateRef': null
      },
      'noOfInvoices': {
        'title': 'No. of Invoice',
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

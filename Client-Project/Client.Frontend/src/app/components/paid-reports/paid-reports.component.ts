import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableComponent } from '../utils/table/table.component';
import { ReportService } from '../../services/report.service';
import { PaidReportDto } from './paid-report-dto';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { DatePickerModule } from 'primeng/datepicker';
import { CommonModule } from '@angular/common';
import { ExportFileService } from '../../services/export-file.service';

@Component({
  selector: 'app-paid-reports',
  imports: [TableComponent, CommonModule, ReactiveFormsModule, DatePickerModule],
  templateUrl: './paid-reports.component.html',
  styleUrl: '../../../componentStyle.css'
})
export class PaidReportsComponent implements OnInit {
  companyId: number | null = null;
  data: PaidReportDto[] = []
  displayedColumns = [
    'subContractor',
    'bankName',
    'invoiceDate',
    'paymentDate',
    'invoiceAmount',
    'paidAmount',
  ]
  columnsInfo: {
    [key: string]: {
      'title'?: string,
      'isSort'?: boolean,
      'templateRef': TemplateRef<any> | null,
    }
  } = {};
  constructor(
    private exportService: ExportFileService,
    private loginService: LoginService,
    private reportService: ReportService
  ) { }
  @ViewChild('paymentDateTemplateRef', { static: true }) paymentDateTemplateRef!: TemplateRef<any>;
  @ViewChild('invoiceDateTemplateRef', { static: true }) invoiceDateTemplateRef!: TemplateRef<any>;
  ngOnInit(): void {
    this.companyId = this.loginService.companyId()
    if (this.companyId) {
      this.reportService.getAllPaidReportsGetDto('?companyId=' + this.companyId).subscribe({
        next: (response: PaidReportDto[]) => {
          this.data = response;
        },
        error: (error) => {
          console.log(error);
        }
      })
      this.columnsInfo = {
        'subContractor': {
          'title': 'Sub-Contractor',
          'isSort': true,
          'templateRef': null
        },
        'bankName': {
          'title': 'Bank Name',
          'isSort': true,
          'templateRef': null
        },
        'invoiceDate': {
          'title': 'Invoice Date',
          'isSort': true,
          'templateRef': this.invoiceDateTemplateRef
        },
        'paymentDate': {
          'title': 'Payment Date',
          'isSort': true,
          'templateRef': this.paymentDateTemplateRef
        },
        'invoiceAmount': {
          'title': 'Invoice Amount',
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
    else{
      this.loginService.logout();
    }
  }

  filterForm: FormGroup = new FormGroup({
    FromDate: new FormControl(null),
    ToDate: new FormControl(null),
    subContractorName: new FormControl(null),
    bankName: new FormControl(null),
  });

  resetFilter() {
    this.filterForm.reset({
      FromDate: null,
      ToDate: null,
      subContractorName: null,
      bankName: null,
    })
  }

  exportToPdf(){
    this.exportService.printToPDF('table','Paid-Report.pdf',[
      'Sub-Contractor',
      'Bank Name',
      'Invoice Date',
      'Payment Date',
      'Invoice Amount',
      'Paid Amount',
    ])
  }

  exportToExcel(){
    this.exportService.printToExcel('table', 'Paid-Report.xlsx', [
      'Sub-Contractor',
      'Bank Name',
      'Invoice Date',
      'Payment Date',
      'Invoice Amount',
      'Paid Amount',
    ])
  }

  onFilterSubmit() {
    function getDateFormat(inputDate: string): string {
      const date = new Date(inputDate);
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yy = String(date.getFullYear()).slice(-2);
      return `${dd}-${mm}-${yy}`;
    }
    let url = '?companyId=' + this.companyId;
    const fromDate = this.filterForm.get('FromDate')?.value;
    const toDate = this.filterForm.get('ToDate')?.value;
    const subContractorName = this.filterForm.get('subContractorName')?.value
    const bankName = this.filterForm.get('bankName')?.value
    if (subContractorName !== null && subContractorName !== '') {
      url += '&subcontractorName=' + subContractorName;
    }
    if (bankName !== null && bankName !== '') {
      url += '&bankName=' + bankName;
    }
    if (fromDate !== null && fromDate !== '') {
      url += '&fromDate=' + getDateFormat(fromDate);
    }
    if (toDate !== null && toDate !== '') {
      url += '&toDate=' + getDateFormat(toDate);
    }
    this.reportService.getAllPaidReportsGetDto(url).subscribe({
      next: (response: PaidReportDto[]) => {
        this.data = response;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}

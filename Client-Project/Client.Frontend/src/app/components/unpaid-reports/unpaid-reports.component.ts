import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TableComponent } from "../utils/table/table.component";
import { ReportService } from '../../services/report.service';
import { UnpaidReportDto } from './unpaid-report-dto';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { ExportFileService } from '../../services/export-file.service';

@Component({
  selector: 'app-unpaid-reports',
  imports: [TableComponent, CommonModule, ReactiveFormsModule, DatePickerModule],
  templateUrl: './unpaid-reports.component.html',
  styleUrl: '../../../componentStyle.css'
})
export class UnpaidReportsComponent {
  companyId: number | null = null;
  data: UnpaidReportDto[] = []
  displayedColumns = [
    'subContractor',
    'invoiceDate',
    'invoiceAmount',
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
  @ViewChild('invoiceDateTemplateRef', { static: true }) invoiceDateTemplateRef!: TemplateRef<any>;
  ngOnInit(): void {
    this.companyId = this.loginService.companyId();
    if(this.companyId){
      this.reportService.getAllUnPaidReportsGetDto('?companyId=' + this.companyId).subscribe({
        next: (response: UnpaidReportDto[]) => {
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
        'invoiceDate': {
          'title': 'Invoice Date',
          'isSort': true,
          'templateRef': this.invoiceDateTemplateRef
        },
        'invoiceAmount': {
          'title': 'Invoice Amount',
          'isSort': true,
          'templateRef': null
        }
      }
    }
    else {
      this.loginService.logout();
    }
  }
  filterForm: FormGroup = new FormGroup({
    FromDate: new FormControl(null),
    ToDate: new FormControl(null),
    subContractorName: new FormControl(null),
  });
  resetFilter() {
    this.filterForm.reset({
      FromDate: null,
      ToDate: null,
      subContractorName: null,
    })
  }

  exportToPdf() {
    this.exportService.printToPDF('table', 'unPaid-Report.pdf', [
      'Sub-Contractor',
      'Invoice Date',
      'Invoice Amount',
    ])
  }

  exportToExcel(){
    this.exportService.printToExcel('table', 'unPaid-Report.xlsx', [
      'Sub-Contractor',
      'Invoice Date',
      'Invoice Amount',
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
      if (subContractorName !== null && subContractorName !== '') {
        url += '&subcontractorName=' + subContractorName;
      }
      if (fromDate !== null && fromDate !== '') {
        url += '&fromDate=' + getDateFormat(fromDate);
      }
      if (toDate !== null && toDate !== '') {
        url += '&toDate=' + getDateFormat(toDate);
      }
      this.reportService.getAllPaidReportsGetDto(url).subscribe({
        next: (response: UnpaidReportDto[]) => {
          this.data = response;
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
}

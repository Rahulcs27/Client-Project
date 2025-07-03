import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableComponent } from '../utils/table/table.component';
import { CompanyMasterServiceService } from '../../services/company-master-service.service';
import { CompanyMasterGetDto } from './Modals/company-master-get-dto';

@Component({
  selector: 'app-company-master',
  imports: [TableComponent],
  templateUrl: './company-master.component.html',
  styleUrl: './company-master.component.css'
})
export class CompanyMasterComponent implements OnInit {
  constructor(private companyMasterService: CompanyMasterServiceService) { }
  displayedColumns: string[] = ['Name', 'Phone', 'Email', 'Action'];
  data: CompanyMasterGetDto[] = [];
  columnsInfo: {
    [key: string]: {
      'title'?: string,
      'isSort'?: boolean,
      'templateRef': TemplateRef<any> | null,
    }
  } = {};
  @ViewChild('actionTemplateRef', { static: true }) actionTemplateRef!: TemplateRef<any>;

  ngOnInit(): void {
    this.columnsInfo = {
      'Name': {
        'title': 'Name',
        'isSort': true,
        'templateRef': null
      },
      'Phone': {
        'title': 'Phone No.',
        'isSort': true,
        'templateRef': null
      },
      'Email': {
        'title': 'Email Address',
        'isSort': true,
        'templateRef': null
      },
      'Action': {
        'title': 'Action',
        'templateRef': this.actionTemplateRef
      }
    }
    this.companyMasterService.getAllCompanyMasterGetDto().subscribe({
      next: (response: CompanyMasterGetDto[]) => {
        this.data = response;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  viewCompanyMasterGetDto() { }

  EditCompanyMasterGetDto() { }
}

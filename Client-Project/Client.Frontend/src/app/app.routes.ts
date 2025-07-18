import { Routes } from '@angular/router';
import { CompanyMasterComponent } from './components/company-master/company-master.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { ProductComponent } from './components/product/product.component';
import { UserMasterComponent } from './components/user-master/user-master.component';
import { RoleComponent } from './components/role/role.component';
import { SubContractorComponent } from './components/sub-contractor/sub-contractor.component';
import { PaymentComponent } from './components/payment/payment.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './auth.guard';
import { PaidReportsComponent } from './components/paid-reports/paid-reports.component';
import { UnpaidReportsComponent } from './components/unpaid-reports/unpaid-reports.component';
import { ProductWiseReportComponent } from './components/product-wise-report/product-wise-report.component';
import { SubContractorWiseReportComponent } from './components/sub-contractor-wise-report/sub-contractor-wise-report.component';
import { BankMasterComponent } from './components/bank-master/bank-master.component';
import { CombinedSubcontractorEntityReportComponent } from './components/combined-subcontractor-entity-report/combined-subcontractor-entity-report.component';
import { AdditionalEntityComponent } from './components/additional-entity/additional-entity.component';
import { RoleGuard } from './role.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'invoice', component: InvoiceComponent, canActivate: [authGuard, RoleGuard], data: { screenCode: 'INVOICE' } },
    { path: 'product', component: ProductComponent, canActivate: [authGuard, RoleGuard], data: { screenCode: 'PRODUCT' }},
    { path: 'subContractor', component: SubContractorComponent, canActivate: [authGuard, RoleGuard], data: { screenCode: 'SUBCONTRACTOR' } },
    { path: 'payment', component: PaymentComponent, canActivate: [authGuard, RoleGuard], data: { screenCode: 'PAYMENT' }},
    { path: 'additionalEntity', component: AdditionalEntityComponent, canActivate: [] },

    { path: 'paidReport', component: PaidReportsComponent, canActivate: [] },
    { path: 'unpaidReport', component: UnpaidReportsComponent, canActivate: [] },
    { path: 'productWiseReport', component: ProductWiseReportComponent, canActivate: [] },
    { path: 'subContractorWiseReport', component: SubContractorWiseReportComponent, canActivate: [] },
    { path: 'combinedSubcontractorEntityReport', component: CombinedSubcontractorEntityReportComponent, canActivate: [] },

    { path: 'companyMaster', component: CompanyMasterComponent, canActivate: [] },
    { path: 'userMaster', component: UserMasterComponent, canActivate: [] },
    { path: 'roleMaster', component: RoleComponent, canActivate: [] },
    { path: 'bankMaster', component: BankMasterComponent, canActivate: [] },
];

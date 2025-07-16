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
import { roleGuard } from './role.guard';
import { PaidReportsComponent } from './components/paid-reports/paid-reports.component';
import { UnpaidReportsComponent } from './components/unpaid-reports/unpaid-reports.component';
import { ProductWiseReportComponent } from './components/product-wise-report/product-wise-report.component';
import { SubContractorWiseReportComponent } from './components/sub-contractor-wise-report/sub-contractor-wise-report.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [] },
    { path: 'invoice', component: InvoiceComponent, canActivate: [] },
    { path: 'product', component: ProductComponent, canActivate: [] },
    { path: 'subContractor', component: SubContractorComponent, canActivate: [] },
    { path: 'payment', component: PaymentComponent, canActivate: [] },

    { path: 'paidReport', component: PaidReportsComponent, canActivate: [roleGuard] },
    { path: 'unpaidReport', component: UnpaidReportsComponent, canActivate: [roleGuard] },
    { path: 'productWiseReport', component: ProductWiseReportComponent, canActivate: [roleGuard] },
    { path: 'subContractorWiseReport', component: SubContractorWiseReportComponent, canActivate: [roleGuard] },

    { path: 'companyMaster', component: CompanyMasterComponent, canActivate: [roleGuard] },
    { path: 'userMaster', component: UserMasterComponent, canActivate: [roleGuard] },
    { path: 'roleMaster', component: RoleComponent, canActivate: [] },
];

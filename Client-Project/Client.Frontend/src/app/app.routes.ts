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

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'invoice', component: InvoiceComponent, canActivate: [authGuard] },
    { path: 'product', component: ProductComponent, canActivate: [authGuard] },
    { path: 'subContractor', component: SubContractorComponent, canActivate: [authGuard] },
    { path: 'payment', component: PaymentComponent, canActivate: [authGuard] },
    { path: 'companyMaster', component: CompanyMasterComponent, canActivate: [authGuard, roleGuard] },
    { path: 'userMaster', component: UserMasterComponent, canActivate: [authGuard, roleGuard] },
    { path: 'roleMaster', component: RoleComponent, canActivate: [authGuard, roleGuard] },
];

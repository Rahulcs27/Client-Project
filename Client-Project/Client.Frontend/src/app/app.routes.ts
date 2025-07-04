import { Routes } from '@angular/router';
import { CompanyMasterComponent } from './components/company-master/company-master.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { ProductComponent } from './components/product/product.component';

export const routes: Routes = [
    { path: 'companyMaster', component: CompanyMasterComponent },
    { path: 'invoice', component: InvoiceComponent },
    { path: 'product', component: ProductComponent },
];

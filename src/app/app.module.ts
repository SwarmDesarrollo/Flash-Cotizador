import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { ProviderComponent } from './pages/provider/provider/provider.component';
import { TariffComponent } from "./pages/tariff/tariff.component";
import { ProductComponent } from "./pages/product/product.component";
import { SettingComponent } from "./pages/setting/setting.component";
import { NewProviderComponent } from "./pages/provider/new-provider/new-provider.component";
import { UpdateProviderComponent } from "./pages/provider/update-provider/update-provider.component";
import { LoginComponent } from "./login/login.component";
import { CreateQuotationComponent } from "./pages/quotation/create-quotation/create-quotation.component";
import { ListQuotationComponent } from './pages/quotation/list-quotation/list-quotation.component';
import { UpdateQuotationComponent } from './pages/quotation/update-quotation/update-quotation.component';
import { ViewQuotationComponent } from './pages/quotation/view-quotation/view-quotation.component';
import { RequestQuotationComponent } from './pages/request-quotation/request-quotation.component';

import { ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from "ngx-spinner";
import { AmountComponent } from './pages/filter-quotation/amount/amount.component';
import { DateComponent } from './pages/filter-quotation/date/date.component';
import { CodeComponent } from './pages/filter-quotation/code/code.component';
import { ListUsersComponent } from './pages/user/users/list-users/list-users.component';
import { CreateUsersComponent } from './pages/user/users/create-users/create-users.component';
import { UpdateUsersComponent } from './pages/user/users/update-users/update-users.component';
import { ListTypeUserComponent } from './pages/user/type-user/list-type-user/list-type-user.component';
import { DiscountComponent } from './pages/discount/discount.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

import { DataTablesModule } from 'angular-datatables';
import { QuotationComponent } from './pdf/quotation/quotation.component';
import { QuoteAssignmentComponent } from './pages/quote-assignment/quote-assignment.component';

import { FileUploadModule } from '@iplab/ngx-file-upload';
import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin.component';
import { ListSaleComponent } from './pages/sale/list-sale/list-sale.component';
import { CreateSaleComponent } from './pages/sale/create-sale/create-sale.component';

import { ListOrdersComponent } from './pages/orders/list-orders/list-orders.component';
import { PrincipalOrdersComponent } from './pages/orders/principal-orders/principal-orders.component';
import { CreateOrderComponent } from './pages/orders/create-order/create-order.component';
import { CompanyComponent } from './pages/company/company.component';
import { ForDeliveryComponent } from './pages/orders/for-delivery/for-delivery.component';
import { DeliveredComponent } from './pages/orders/delivered/delivered.component';
import { ReportComponent } from './pages/report/report.component';
import { CommissionComponent } from './pages/commission/commission.component';
import { SaleService } from './services/sale/sale.service'; // Import SaleService


@NgModule({
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,

    ToastrModule.forRoot(),
    NgxPaginationModule,
    NgxSpinnerModule,
    DataTablesModule,
    FileUploadModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    ProviderComponent,
    TariffComponent,
    ProductComponent,
    SettingComponent,
    NewProviderComponent,
    UpdateProviderComponent,
    LoginComponent,
    CreateQuotationComponent,
    ListQuotationComponent,
    UpdateQuotationComponent,
    ViewQuotationComponent,
    RequestQuotationComponent,
    AmountComponent,
    DateComponent,
    CodeComponent,
    ListUsersComponent,
    CreateUsersComponent,
    UpdateUsersComponent,
    ListTypeUserComponent,
    DiscountComponent,
    UserProfileComponent,
    QuotationComponent,
    QuoteAssignmentComponent,
    DashboardAdminComponent,
    ListSaleComponent,
    CreateSaleComponent,
    ListOrdersComponent,
    PrincipalOrdersComponent,
    CreateOrderComponent,
    CompanyComponent,
    ForDeliveryComponent,
    DeliveredComponent,
    ReportComponent,
    CommissionComponent,
  ],
  providers: [SaleService],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }

import 'flatpickr/dist/flatpickr.css';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SiderComponent } from './sider/sider.component';
// import { ContentComponent } from './content/content.component';
import { HomeComponent } from './home/home.component';
import { MarketComponent } from './content/market/market.component';
import { PollComponent } from './content/poll/poll.component';
import { ScheduleComponent } from './content/schedule/schedule.component';
import { AccountComponent } from './content/account/account.component';
import { LoginComponent } from './auth/login/login.component';
import { routes } from './routes/routes';

import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
// import { FormsModule } from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS, HttpClientXsrfModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData, CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import en from '@angular/common/locales/en';

import { JwtInterceptor, ErrorInterceptor } from './auth/helpers';
import { fakeBackendProvider } from './auth/helpers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './auth/register/register.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { JobRequestComponent } from './content/market/job_request/request.component';
import { JobDetailComponent } from './content/market/job_detail/detail.component';
import { PollRequestComponent } from './content/poll/poll_request/pollRequest.component';
import { PollDetailComponent } from './content/poll/poll_detail/pollDetail.component';
import { AuthGuard } from './services/auth-guard.service';
import { CreditComponent } from './credit/credit.component';


// import { MaterialModule, MdDatepickerModule, MdNativeDateModule } from '@angular/material';

registerLocaleData(en);

// const appRoutes: Routes = [
//   {
//     path: '',
//     component: HomeComponent,
//     children: [
//       { path: 'market', component: MarketComponent},
//       { path: 'account', component: AccountComponent },
//       { path: 'schedule', component: ScheduleComponent },
//       { path: 'poll', component: PollComponent },
//     ]
//   },
//   { path: 'login', component: LoginComponent }
// ];

@NgModule({
  declarations: [
    AppComponent,
    SiderComponent,
    HeaderComponent,
    JobDetailComponent,
    HomeComponent,
    MarketComponent,
    PollComponent,
    ScheduleComponent,
    AccountComponent,
    LoginComponent,
    RegisterComponent,
    PollRequestComponent,
    PollDetailComponent,
    JobRequestComponent,
    CreditComponent
  ],
  imports: [
    BrowserModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    CKEditorModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    fakeBackendProvider,
    AuthGuard
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }

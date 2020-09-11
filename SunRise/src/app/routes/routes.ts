import { HomeComponent } from "../home/home.component";
import { MarketComponent } from '../content/market/market.component';
import { AccountComponent } from '../content/account/account.component';
import { PollComponent } from '../content/poll/poll.component';
import { ScheduleComponent } from '../content/schedule/schedule.component';
import { LoginComponent } from '../auth/login/login.component';
import { RegisterComponent } from '../auth/register/register.component';
import { JobRequestComponent } from '../content/market/job_request/request.component';
import { JobDetailComponent } from '../content/market/job_detail/detail.component';
import { PollRequestComponent } from '../content/poll/poll_request/pollRequest.component';
import { AuthGuard } from '../services/auth-guard.service';
import { PollDetailComponent } from '../content/poll/poll_detail/pollDetail.component';
import { CreditComponent } from '../credit/credit.component';

export const routes = [
    {
      path: 'home',
      component: HomeComponent,
      canActivate: [AuthGuard],
      children: [
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: 'market', component: MarketComponent, canActivate: [AuthGuard]},
        { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
        { path: 'schedule', component: ScheduleComponent, canActivate: [AuthGuard] },
        { path: 'poll', component: PollComponent, canActivate: [AuthGuard] },
        { path: 'market/post_job', component: JobRequestComponent, canActivate: [AuthGuard]},
        { path: 'poll/post_poll', component: PollRequestComponent, canActivate: [AuthGuard]},
        { path: 'poll/detail/:id', component: PollDetailComponent, canActivate: [AuthGuard]},
        { path: 'market/detail/:id', component: JobDetailComponent, canActivate: [AuthGuard]},
        { path: 'credit', component: CreditComponent, canActivate: [AuthGuard]}
      ]
    },
    { path: '', component: LoginComponent },
    { path: 'register', component: RegisterComponent},
    // { path: 'post_job', component: JobRequestComponent},
  ];

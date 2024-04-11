import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { UservirifyComponent } from './components/uservirify/uservirify.component';
import { ActivateAccountComponent } from './components/activate-account/activate-account.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

const routes: Routes = [//you have to add the components here, but also, you have to add the router outlet to the app html page
  {path:"", component: LoginComponent},
  {path:"signup", component:SignupComponent},
  {path:"userverify", component:UservirifyComponent},
  {path:"activateAccount", component:ActivateAccountComponent},
  {path:"dashboard", component:DashboardComponent},
  {path:"forgotpassword", component:ForgotPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

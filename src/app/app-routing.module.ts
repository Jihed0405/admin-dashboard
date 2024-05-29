import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoryListComponent } from './admin/category-list/category-list.component';
import { ServiceListComponent } from './admin/service-list/service-list.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './AuthGuard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'categories', component: CategoryListComponent },
      { path: 'services', component: ServiceListComponent },
      { path: 'users', component: UserListComponent },
      { path: '', redirectTo: 'categories', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // Redirect to dashboard
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

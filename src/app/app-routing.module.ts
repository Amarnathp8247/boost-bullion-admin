import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth-part/login/login.component';
import { SideBarComponent } from './components/pages/side-bar/side-bar.component';
import { AuthGuard } from './auth/auth.guard';
import { UserUpdateComponent } from './components/pages/user/user-update/user-update.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
 
  {
    path: '',
    component: SideBarComponent,
    children: [
      { path: 'dashboard', loadChildren: () => import('./components/pages/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
      { path: 'transaction', loadChildren: () => import('./components/pages/transaction/transaction.module').then(m => m.TransactionModule), canActivate: [AuthGuard] },
      
      { path: 'support', loadChildren: () => import('./components/pages/support/support.module').then(m => m.SupportModule) },
      { path: 'user-list', loadChildren: () => import('./components/pages/user/user-list/user-list.module').then(m => m.UserListModule) },
  
      { path: 'reffral-tree', loadChildren: () => import('./components/pages/user/reffral-tree/reffral-tree.module').then(m => m.ReffralTreeModule) },
  
    
      {
        path:"update-user",
        component:UserUpdateComponent
      }

      // Add other protected routes here
    ]
  },
  
  

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

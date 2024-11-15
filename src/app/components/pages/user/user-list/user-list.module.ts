import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserListRoutingModule } from './user-list-routing.module';
import { UserListComponent } from './user-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserUpdateComponent } from '../user-update/user-update.component';
import { UserKycComponent } from '../user-kyc/user-kyc.component';
import { TeamTransferComponent } from '../team-transfer/team-transfer.component';


@NgModule({
  declarations: [
    UserListComponent,
    UserUpdateComponent,
    UserKycComponent,
    TeamTransferComponent,
  ],
  imports: [
    CommonModule,
    UserListRoutingModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
   
  ]
})
export class UserListModule { }

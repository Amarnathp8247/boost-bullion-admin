import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReffralTreeComponent } from './reffral-tree.component';

const routes: Routes = [{ path: '', component: ReffralTreeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReffralTreeRoutingModule { }

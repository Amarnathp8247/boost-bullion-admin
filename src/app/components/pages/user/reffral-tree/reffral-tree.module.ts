import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReffralTreeRoutingModule } from './reffral-tree-routing.module';
import { ReffralTreeComponent } from './reffral-tree.component';
import { TreeModule } from 'primeng/tree';

@NgModule({
  declarations: [
    ReffralTreeComponent
  ],
  imports: [
    CommonModule,
    ReffralTreeRoutingModule,
    TreeModule,
  ]
})
export class ReffralTreeModule { }

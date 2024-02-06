import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OptoComponent } from './opto.component';
import { ProgrammeOptoComponent } from './programme-opto/programme-opto.component';

const routes: Routes = [
  { path:'', component: OptoComponent },
  { path:'programme-opto', component: ProgrammeOptoComponent },
]

@NgModule({  
  imports: [RouterModule.forChild(routes)], //Utilisation de forChild car il y a un loadChildren dans intranet-routing.module!!
  exports: [RouterModule],
})
export class OptoRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KineComponent } from './kine.component';
import { ProgrammeKineComponent } from './programme-kine/programme-kine.component';


const routes: Routes = [
  { path:'', component: KineComponent },
  // { path: '/modifier/:id', component: EditKineComponent}
  { path:'programme-kine', component: ProgrammeKineComponent }
  // { path: 'programme-kine/modifier/:id', component: EditProgrammeKineComponent}
]


@NgModule({
  imports: [RouterModule.forChild(routes)], //Utilisation de forChild car il y a un loadChildren dans intranet-routing.module!!
  exports: [RouterModule],
})
export class KineRoutingModule { }

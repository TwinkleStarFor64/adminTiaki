import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KineComponent } from './kine.component';
import { ProgrammesKineComponent } from './programmes-kine/programmes-kine.component';
import { ExercicesComponent } from './exercices/exercices.component';



const routes: Routes = [
  { path:'', component: KineComponent, children: [
    { path:'', component: ExercicesComponent },
    { path:'programmes-kine', component: ProgrammesKineComponent },
  ] },
  // { path: '/modifier/:id', component: EditKineComponent}
  // { path: 'programme-kine/modifier/:id', component: EditProgrammeKineComponent}
]


@NgModule({
  imports: [RouterModule.forChild(routes)], //Utilisation de forChild car il y a un loadChildren dans intranet-routing.module!!
  exports: [RouterModule],
})
export class KineRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnexionComponent } from './extranet/connexion/connexion.component';

const routes: Routes = [
  { path: '', component: ConnexionComponent },
  { 
    path: 'intranet',
    loadChildren: () =>
      import('./intranet/intranet.module').then((m) => m.IntranetModule),  
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

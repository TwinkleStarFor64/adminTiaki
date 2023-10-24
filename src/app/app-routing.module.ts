import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnexionComponent } from './extranet/connexion/connexion.component';
import { authGuard } from './guards/auth.guard';
import { RecoveryComponent } from './extranet/recovery/recovery.component';

const routes: Routes = [
  { path: '', component: ConnexionComponent },
  { path: 'recovery', component: RecoveryComponent },
  { 
    path: 'intranet',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./intranet/intranet.module').then((m) => m.IntranetModule),  
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntranetComponent } from './intranet.component';
import { AccueilComponent } from './accueil/accueil.component';
import { ProfilComponent } from './profil/profil.component';
import { adminGuard } from '../guards/admin.guard';
import { redacteurOptoGuard } from '../guards/redacteur-opto.guard';
import { redacteurKineGuard } from '../guards/redacteur-kine.guard';
import { redacteurNutritionGuard } from '../guards/redacteur-nutrtion.guard';

const routes: Routes = [
  {
    path: '',
    component: IntranetComponent,
    children: [
      { path: '', component: AccueilComponent },
      { path: 'profil', component: ProfilComponent },      
      {
        path: 'kine',
        canActivate: [redacteurKineGuard],
        loadChildren: () =>
          import('./kine/kine.module').then((m) => m.KineModule)
      },
      {
        path: 'opto',
        canActivate: [redacteurOptoGuard],        
        loadChildren: () =>
          import('./opto/opto.module').then((m) => m.OptoModule) 
      },
      { 
        path: 'nutrition',
        canActivate: [redacteurNutritionGuard],
        loadChildren: () =>
          import('./nutrition/nutrition.module').then((m) => m.NutritionModule),
      },
      {
        path: 'gestion',
        canActivate: [adminGuard],
        loadChildren: () =>
          import('./gestion/gestion.module').then((m) => m.GestionModule),
      },
      { path: '**', redirectTo: '' } // Important pour le bon focntionnement du router
    ]
  }
];
/**
 * @description Utilisation de forChild caril y a un loadChildren dans app-routing.module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntranetRoutingModule {}

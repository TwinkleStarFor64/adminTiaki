import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntranetComponent } from './intranet.component';
import { AccueilComponent } from './accueil/accueil.component';
import { KineComponent } from './kine/kine.component';
import { OptoComponent } from './opto/opto.component';
import { NutritionComponent } from './nutrition/nutrition.component';
import { ProgrammeKineComponent } from './kine/programme-kine/programme-kine.component';
import { ProgrammeOptoComponent } from './opto/programme-opto/programme-opto.component';
import { MenusComponent } from './nutrition/menus/menus.component';
import { IngredientsComponent } from './nutrition/ingredients/ingredients.component';
import { ComplementsComponent } from './nutrition/complements/complements.component';
import { AllergenesComponent } from './nutrition/allergenes/allergenes.component';
import { ProfilComponent } from './profil/profil.component';

const routes: Routes = [
  {
    path: '',
    component: IntranetComponent,
    children: [
      { path: '', component: AccueilComponent },
      { path: 'profil', component: ProfilComponent },
      { path: 'kine', component: KineComponent },
      // { path: 'kine/modifier/:id, component: EditKineComponent}
      { path: 'kine/programme-kine', component: ProgrammeKineComponent },
      // { path: 'kine/programme-kine/modifier/:id, component: EditProgrammeKineComponent}

      { path: 'opto', component: OptoComponent },
      { path: 'opto/programme-opto', component: ProgrammeOptoComponent },

      { path: 'nutrition', component: NutritionComponent },
      { path: 'nutrition/menus', component: MenusComponent },
      { path: 'nutrition/ingredients', component: IngredientsComponent },
      { path: 'nutrition/complements', component: ComplementsComponent },
      { path: 'nutrition/allergenes', component: AllergenesComponent  },

      {
        path: 'gestion',
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
  exports: [RouterModule]
})
export class IntranetRoutingModule { }

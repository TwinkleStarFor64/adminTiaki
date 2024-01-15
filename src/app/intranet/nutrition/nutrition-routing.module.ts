import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NutritionComponent } from './nutrition.component';
import { MenusComponent } from './menus/menus.component';
import { AllergenesComponent } from './allergenes/allergenes.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { PlatsComponent } from './plats/plats.component';
import { NutrimentsComponent } from './nutriments/nutriments.component';

const routes: Routes = [
  { path: '', component: NutritionComponent, children: [
  { path: '', component: PlatsComponent },
  { path : 'allergenes', component: AllergenesComponent },
  { path: 'nutriments', component: NutrimentsComponent },
  { path: 'ingredients', component: IngredientsComponent },
  { path: 'menus', component: MenusComponent }
  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)], //Utilisation de forChild car il y a un loadChildren dans intranet-routing.module!!
  exports: [RouterModule],

})
export class NutritionRoutingModule { }

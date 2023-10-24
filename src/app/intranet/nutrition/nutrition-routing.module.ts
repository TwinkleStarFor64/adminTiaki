import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NutritionComponent } from './nutrition.component';
import { MenusComponent } from './menus/menus.component';
import { AllergenesComponent } from './allergenes/allergenes.component';
import { ComplementsComponent } from './complements/complements.component';
import { IngredientsComponent } from './ingredients/ingredients.component';

const routes: Routes = [
  { path: '', component: NutritionComponent },
  { path : 'allergenes', component: AllergenesComponent },
  { path: 'complements', component: ComplementsComponent },
  { path: 'ingredients', component: IngredientsComponent },
  { path: 'menus', component: MenusComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class NutritionRoutingModule { }

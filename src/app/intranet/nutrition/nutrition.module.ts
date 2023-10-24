import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllergenesComponent } from './allergenes/allergenes.component';
import { ComplementsComponent } from './complements/complements.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { MenusComponent } from './menus/menus.component';
import { NutritionRoutingModule } from './nutrition-routing.module';



@NgModule({
  declarations: [
    AllergenesComponent,
    ComplementsComponent,
    IngredientsComponent,
    MenusComponent
  ],
  imports: [
    CommonModule,
    NutritionRoutingModule
  ]
})
export class NutritionModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllergenesComponent } from './allergenes/allergenes.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { MenusComponent } from './menus/menus.component';
import { NutritionRoutingModule } from './nutrition-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PlatsComponent } from './plats/plats.component';
import { NutrimentsComponent } from './nutriments/nutriments.component';


@NgModule({
  declarations: [
    AllergenesComponent,
    IngredientsComponent,
    MenusComponent,
    PlatsComponent,
    NutrimentsComponent,
  ],
  imports: [
    CommonModule,
    NutritionRoutingModule,
    SharedModule
  ],
})
export class NutritionModule { }

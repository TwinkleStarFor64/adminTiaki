import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllergenesComponent } from './allergenes/allergenes.component';
import { ComplementsComponent } from './complements/complements.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { MenusComponent } from './menus/menus.component';
import { NutritionRoutingModule } from './nutrition-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { IngredientsPipe } from 'src/app/pipes/ingredients.pipe';
import { PlatsPipe } from 'src/app/pipes/plats.pipe';




@NgModule({
  declarations: [
    AllergenesComponent,
    ComplementsComponent,
    IngredientsComponent,
    MenusComponent,

  ],
  imports: [
    CommonModule,
    NutritionRoutingModule,
    SharedModule
  ],
  exports:[
    IngredientsPipe,
  ],
})
export class NutritionModule { }

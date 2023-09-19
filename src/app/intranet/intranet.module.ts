import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccueilComponent } from './accueil/accueil.component';
import { KineComponent } from './kine/kine.component';
import { OptoComponent } from './opto/opto.component';
import { NutritionComponent } from './nutrition/nutrition.component';
import { IntranetRoutingModule } from './intranet-routing.module';
import { IntranetComponent } from './intranet.component';
import { ProgrammeKineComponent } from './kine/programme-kine/programme-kine.component';
import { ProgrammeOptoComponent } from './opto/programme-opto/programme-opto.component';
import { MenusComponent } from './nutrition/menus/menus.component';
import { IngredientsComponent } from './nutrition/ingredients/ingredients.component';
import { ComplementsComponent } from './nutrition/complements/complements.component';
import { AsideBarComponent } from './template/aside-bar/aside-bar.component';
import { AllergenesComponent } from './nutrition/allergenes/allergenes.component';


@NgModule({
  declarations: [
    AccueilComponent,
    KineComponent,
    OptoComponent,
    NutritionComponent,
    IntranetComponent,
    ProgrammeKineComponent,
    ProgrammeOptoComponent,
    MenusComponent,
    IngredientsComponent,
    ComplementsComponent,
    AsideBarComponent,
    AllergenesComponent,
   
    
  ],
  imports: [
    CommonModule,
    IntranetRoutingModule, 
  ]
})
export class IntranetModule { }

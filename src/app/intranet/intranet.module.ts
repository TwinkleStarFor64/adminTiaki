import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccueilComponent } from './accueil/accueil.component';
import { KineComponent } from './kine/kine.component';
import { OptoComponent } from './opto/opto.component';
import { NutritionComponent } from './nutrition/nutrition.component';
import { IntranetRoutingModule } from './intranet-routing.module';
import { IntranetComponent } from './intranet.component';


@NgModule({
  declarations: [
    AccueilComponent,
    KineComponent,
    OptoComponent,
    NutritionComponent,
    IntranetComponent
    
  ],
  imports: [
    CommonModule,
    IntranetRoutingModule
  ]
})
export class IntranetModule { }

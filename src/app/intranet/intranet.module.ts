import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccueilComponent } from './accueil/accueil.component';
import { KineComponent } from './kine/kine.component';
import { OptoComponent } from './opto/opto.component';
import { NutritionComponent } from './nutrition/nutrition.component';
import { IntranetRoutingModule } from './intranet-routing.module';
import { IntranetComponent } from './intranet.component';
import { AsideBarComponent } from './template/aside-bar/aside-bar.component';
import { ProfilComponent } from './profil/profil.component';
import { DonneesService } from '../partage/services/donnees.service';
import { SharedModule } from '../shared/shared.module';
import { AjoutPlatComponent } from './template/dialog/ajout-plat/ajout-plat.component';


@NgModule({
  declarations: [
    AccueilComponent,
    KineComponent,
    OptoComponent,
    NutritionComponent,
    IntranetComponent,    
    AsideBarComponent,                                                                                                                                                                                              
    ProfilComponent,
    AjoutPlatComponent
  ],
  imports: [
    CommonModule,
    IntranetRoutingModule,
    SharedModule
  ],
  exports:[

  ],
  providers: [
    DonneesService,    
  ]
})
export class IntranetModule { }

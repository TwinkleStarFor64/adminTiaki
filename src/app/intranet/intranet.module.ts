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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast'; // Pour les pop-up de MessageService
import { HttpClientModule } from '@angular/common/http';
import { DonneesService } from '../partage/services/donnees.service';


@NgModule({
  declarations: [
    AccueilComponent,
    KineComponent,
    OptoComponent,
    NutritionComponent,
    IntranetComponent,    
    AsideBarComponent,
    ProfilComponent,   
    
  ],
  imports: [
    CommonModule,
    IntranetRoutingModule, 
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,    
    ToastModule,
    HttpClientModule,
     
  ],
  providers: [
    DonneesService,
  ]
 
})
export class IntranetModule { }

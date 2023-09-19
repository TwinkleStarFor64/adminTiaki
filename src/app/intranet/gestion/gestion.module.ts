import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaComponent } from './media/media.component';
import { AbonnementComponent } from './abonnement/abonnement.component';
import { CommunauteComponent } from './communaute/communaute.component';
import { MessagerieComponent } from './messagerie/messagerie.component';
import { AjoutUtilisateurComponent } from './ajout-utilisateur/ajout-utilisateur.component';
import { GestionRoutingModule } from './gestion-routing.module';
import { GestionComponent } from './gestion.component';



@NgModule({
  declarations: [
    MessagerieComponent,
    CommunauteComponent,
    AbonnementComponent,
    MediaComponent,
    AjoutUtilisateurComponent,
    GestionComponent

  ],
  imports: [
    CommonModule,
    GestionRoutingModule
  ]
})
export class GestionModule { }

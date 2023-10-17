import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaComponent } from './media/media.component';
import { AbonnementComponent } from './abonnement/abonnement.component';
import { CommunauteComponent } from './communaute/communaute.component';
import { MessagerieComponent } from './messagerie/messagerie.component';
import { AjoutUtilisateurComponent } from './ajout-utilisateur/ajout-utilisateur.component';
import { GestionRoutingModule } from './gestion-routing.module';
import { GestionComponent } from './gestion.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DeleteDataComponent } from '../template/dialog/delete-data/delete-data.component';
import { ConfirmationService, MessageService } from 'primeng/api';




@NgModule({
  declarations: [
    MessagerieComponent,
    CommunauteComponent,
    AbonnementComponent,
    MediaComponent,
    AjoutUtilisateurComponent,
    GestionComponent,
    DeleteDataComponent
    
  ],
  imports: [
    CommonModule,
    GestionRoutingModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService, MessageService],
})
export class GestionModule { }

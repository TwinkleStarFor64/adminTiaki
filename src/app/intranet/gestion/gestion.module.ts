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
import { CheckAccesPipe, GestionUtilisateursPipe } from 'src/app/pipes/gestion-utilisateurs.pipe';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    MessagerieComponent,
    CommunauteComponent,
    AbonnementComponent,
    MediaComponent,
    AjoutUtilisateurComponent,
    GestionComponent,
    DeleteDataComponent,
    UtilisateursComponent,
   
  ],
  imports: [
    CommonModule,
    GestionRoutingModule,
    SharedModule 
  ],
  exports: [DeleteDataComponent],
  providers: [ConfirmationService, MessageService, GestionUtilisateursPipe, CheckAccesPipe],
})
export class GestionModule { }

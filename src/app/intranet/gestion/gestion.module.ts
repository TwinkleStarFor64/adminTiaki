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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CheckAccesPipe, GestionUtilisateursPipe } from 'src/app/pipes/gestion-utilisateurs.pipe';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';


@NgModule({
  declarations: [
    MessagerieComponent,
    CommunauteComponent,
    AbonnementComponent,
    MediaComponent,
    AjoutUtilisateurComponent,
    GestionComponent,
    DeleteDataComponent,
    GestionUtilisateursPipe,
    CheckAccesPipe,
    UtilisateursComponent
  ],
  imports: [
    CommonModule,
    GestionRoutingModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    
  ],
  exports: [DeleteDataComponent],
  providers: [ConfirmationService, MessageService],
})
export class GestionModule { }

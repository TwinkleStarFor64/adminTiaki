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
import { GestionUtilisateursPipe } from 'src/app/pipes/gestion-utilisateurs.pipe';
import { EditUserComponent } from '../template/dialog/edit-user/edit-user.component';
import { DialogModule } from 'primeng/dialog';


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
    EditUserComponent,
  
  ],
  imports: [
    CommonModule,
    GestionRoutingModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    DialogModule
  ],
  exports: [DeleteDataComponent],
  providers: [ConfirmationService, MessageService],
})
export class GestionModule { }

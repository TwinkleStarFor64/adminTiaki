import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionComponent } from './gestion.component';
import { AjoutUtilisateurComponent } from './ajout-utilisateur/ajout-utilisateur.component';
import { MessagerieComponent } from './messagerie/messagerie.component';
import { CommunauteComponent } from './communaute/communaute.component';
import { AbonnementComponent } from './abonnement/abonnement.component';
import { MediaComponent } from './media/media.component';


const routes: Routes = [
  { path: '', component: GestionComponent },
  { path: 'ajout-utilisateurs', component: AjoutUtilisateurComponent },
  { path: 'messagerie', component: MessagerieComponent },
  { path: 'communaute', component: CommunauteComponent },
  { path: 'abonnement', component: AbonnementComponent },
  { path: 'medias', component: MediaComponent },
];
/**
 * @description Utilisation de forChild car il y a un loadChildren dans intranet-routing.module!!
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class GestionRoutingModule { }

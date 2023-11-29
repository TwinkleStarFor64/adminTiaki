import { Component, OnInit } from '@angular/core';
import { UtilisateurI } from 'src/app/partage/modeles/Types';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { UsersService } from 'src/app/partage/services/users.service';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
  providers: [ConfirmationService, MessageService], // Pour les modals PrimeNG
})
export class ProfilComponent implements OnInit {

  utilisateur: UtilisateurI[] = [];  

  stringRegex!: RegExp;
  numberRegex!: RegExp;
  passwordRegex!: RegExp;
  
  password: string = ''; // Pour le ngModel password
  confirmPassword: string = ''; // Pour le ngModel confirmPassword  

  constructor(
    public supa: SupabaseService,
    public users: UsersService,    
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.stringRegex = /^[a-zA-Z ]*$/;
    this.numberRegex = /^\d+$/;
    this.passwordRegex = /^[A-Za-z0-9]{6,}$/;    
  }
  
  // Méthode pour mettre à jour le profil - utilisé dans la modal de confirmation du formulaire
  async onSubmitForm() {    
    try {       
        // j'utilise l'id de l'user pour update son profil
        await this.supa.updateProfil(this.users.profil.id,{nom:this.users.profil.nom, prenom:this.users.profil.prenom!, telephone:this.users.profil.telephone!});
            
      } catch (error) {
      console.error("Une erreur s'est produite :", error);
    }
  }

  // Méthode pour la modal de confirmation de modification du formulaire de profil utilisateur
  ConfirmDialog() {
    this.confirmationService.confirm({
      // Le contenu de la boîte de dialogue
      message: 'Etes vous sûr de vouloir enregistrer ces modifications ?',
      header: 'Modifier les informations personnelles',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          // Pour la pop-up
          severity: 'info',
          summary: 'Confirmation',
          detail: 'Modifications enregistrées',
        });
        console.log('Accept a été appelé');
        this.onSubmitForm(); // J'appelle la méthode d'envoie du formulaire
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              // Pour la pop-up
              severity: 'error',
              summary: 'Annuler',
              detail: 'Vous avez annuler',
            });
            console.log('Non a été cliqué, la modal sera simplement fermée.');
            this.users.fetchProfil();
            // Si j'annule les modifications je reviens aux valeurs initiales du formulaires en rappelant this.users.fetchProfil();                                        
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              // Pour la pop-up
              severity: 'error',
              summary: 'Annuler',
              detail: 'Vous avez annuler',
            });
            console.log('Annulation');
            this.users.fetchProfil();
            // Si j'annule les modifications je reviens aux valeurs initiales du formulaires en rappelant this.users.fetchProfil();                       
            break;
        }
      },
    });
  }

  // Méthode pour la modal de suppression du compte
  DeleteDialog() {
    this.confirmationService.confirm({
      // Le contenu de la boîte de dialogue
      message: 'Etes vous sûr de vouloir supprimer votre compte ?',
      header: 'Supprimer le compte',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteCompte(); // J'appele la méthode de suppression du compte
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              // Pour la pop-up
              severity: 'error',
              summary: 'Annuler',
              detail: 'Vous avez annuler',
            });
            console.log('Non a été cliqué, la modal sera simplement fermée.');
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              // Pour la pop-up
              severity: 'warn',
              summary: 'Annuler',
              detail: 'Vous avez annuler',
            });
            console.log('Annulation');
            break;
        }
      },
    });
  }

  // Méthode pour supprimer son compte
  async deleteCompte() {
    try {
      // Je récupére les données de l'user connecté - surtout son id
      const userData = await this.supa.getLoggedInUser();

      if (!userData) {
        // Si pas de data
        throw new Error('Aucune donnée utilisateur disponible.');
      }
      this.supa
        .deleteUser(userData.id) // Appelle de la méthode deleteUser avec en paramétre l'id de l'user récupérer
        .then(() => {
          sessionStorage.removeItem('token'); // Delete du token d'authentification
          this.router.navigate(['']); // Retour à la page principale de l'appli
        });
      //console.log('deleteCompte de cet Id', userData.id);
    } catch (error) {
      console.error('Erreur méthode deleteCompte : ', error);
    }
  }

// Méthode pour modifier le mot de passe
  onSubmitNewPassword() {    
    //console.log(this.password);    
    this.supa.updatePass(this.password); // La valeur de l'input [(ngModel)]="password"
  }

}
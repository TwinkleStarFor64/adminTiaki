import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RoleData, UtilisateurI } from 'src/app/partage/modeles/Types';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { UsersService } from 'src/app/partage/services/users.service';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
  providers: [ConfirmationService, MessageService], // Pour les modals PrimeNG
})
export class ProfilComponent implements OnInit {
  utilisateur: UtilisateurI[] = [];
  role: RoleData[] = [];

  idRole!: string; // Utiliser dans la méthode getUserProfil()
  rolesConcatenated: string = ''; // Utiliser dans la méthode getUserProfil() pour afficher les rôles dans le front-end

  profilForm!: FormGroup;

  stringRegex!: RegExp;
  numberRegex!: RegExp;
  passwordRegex!: RegExp;
  
  password: string = ''; // Pour le ngModel password
  confirmPassword: string = ''; // Pour le ngModel confirmPassword  

  constructor(
    public supa: SupabaseService,
    public users: UsersService,
    private formbuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    //this.supa.getLoggedInUser();
    this.getUserProfil();

    this.stringRegex = /^[a-zA-Z ]*$/;
    this.numberRegex = /^\d+$/;
    this.passwordRegex = /^[A-Za-z0-9]{6,}$/;

    this.profilForm = this.formbuilder.group({
      nom: ['', [Validators.required, Validators.pattern(this.stringRegex)]],
      prenom: ['', [Validators.required, Validators.pattern(this.stringRegex)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(this.numberRegex)],],
    });
    
  }

  // Méthode pour récupérer l'utilisateur identifié et son profil y compris ces rôles
  async getUserProfil() {
    try {
      const userData = await this.supa.getLoggedInUser(); // Récupére les données de l'user connecté - y compris son id (sur la table auth)
      if (!userData) {
        // Si pas de user
        throw new Error('Aucune donnée utilisateur disponible.');
      }
      //console.log(userData.id);
      // Si j'ai un user je peux récupérer son id avec userData.id
      // J'utilise cette id pour récupérer l'user sur la table utilisateurs (ci-dessous)
      const userIdData = (await this.supa.getUtilisateurById(userData.id)).data;
      if (userIdData) {
        console.log("variable userIdData", userIdData);
        // Variable utilisateur de type UtilisateurI à laquelle j'attribue les data récupérées
        this.utilisateur = userIdData.map((item: { [x: string]: any }) => ({
          id: item['id'],
          email: item['email'],
          nom: item['nom'],
          prenom: item['prenom'],
          telephone: item['telephone'],
        }));        
        //console.log("Nom d'utilisateur", this.utilisateur.map((item) => item['nom']).join(', '));
      }
      // Je remplis les values du formulaire avec les data de l'user - je récupére un tableau avec un seul élément
      // Comme je récupére un tableau je rajoute [0]     
         this.profilForm.setValue({
          nom: this.utilisateur[0]?.nom,
          prenom: this.utilisateur[0]?.prenom,
          telephone: this.utilisateur[0]?.telephone,
          email: this.utilisateur[0]?.email
         });       

      const roleIdData = (await this.supa.getRoleId(userData.id)).data;
      //console.log("ici c'est roleId.data", roleIdData);
      //Je fetch sur la table attribuerRoles tous les rôles correspondants à l'id de cet user
      if (roleIdData) {
        for (const item of roleIdData) {
          console.log('ID du rôle : ', item.idRole);
          this.idRole = item.idRole; // J'attribue à la variable idRole les id des rôles récupérés
          console.log('this.idRole : ', this.idRole);

          //Pour chacun de ces rôles je fetch sur la table roles
          const userRoleData = (await this.supa.getRoleById(this.idRole)).data;
          //console.log(userRoleData);

          if (userRoleData) {
            this.role = this.role.concat(userRoleData); // Concat des tableaux userRoleData en un seul tableau de type RoleData
            console.log(this.role.map((item) => item['role']).join(', '));
            // Map du résultat et affichage avec .join
            this.rolesConcatenated = this.role
              .map((item) => item.role)
              .join(', ');
          }
        }
      }      
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
    }
  }

  // Méthode pour mettre à jour le profil - utilisé dans la modal de confirmation du formulaire
  async onSubmitForm() {
    console.log(this.profilForm.value);
    try {
      const userData = await this.supa.getLoggedInUser(); // Je récupére l'user connecté

      if (!userData) {
        throw new Error('Aucune donnée utilisateur disponible.');
      }

      console.log('le submit', userData.id);
      // j'utilise l'id de l'user pour update son profil
      await this.supa.updateProfil(userData.id,this.profilForm.value);
      this.utilisateur[0] = {
        id: this.profilForm.get('id')?.value,
        nom: this.profilForm.get('nom')?.value,
        prenom: this.profilForm.get('prenom')?.value,
        telephone: this.profilForm.get('telephone')?.value,
        email: this.profilForm.get('email')?.value
      };  

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
            // Si j'annule les modifications je reviens aux valeurs initiales du formulaires            
            this.profilForm.setValue({
              nom: this.utilisateur[0]?.nom,
              prenom: this.utilisateur[0]?.prenom,
              telephone: this.utilisateur[0]?.telephone,
              email: this.utilisateur[0]?.email
             });                             
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              // Pour la pop-up
              severity: 'error',
              summary: 'Annuler',
              detail: 'Vous avez annuler',
            });
            console.log('Annulation');
            // Si j'annule les modifications je reviens aux valeurs initiales du formulaires 
            this.profilForm.setValue({
              nom: this.utilisateur[0]?.nom,
              prenom: this.utilisateur[0]?.prenom,
              telephone: this.utilisateur[0]?.telephone,
              email: this.utilisateur[0]?.email
             });            
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






























/* async getUserProfilBis(email: string, password: string) {
    this.supa.signIn(email, password).then(() => {
      // Les actions à effectuer après la connexion réussie
      // Vous pouvez accéder aux données dans votre service via les propriétés du service.
      console.log('Utilisateur connecté : ', this.supa.user);
      console.log('Token de session : ', this.supa.token);
    });
    throw new Error('Echec de la méthode getUserProfil');
  } */

/* async getUserProfil() {
    const userData = await this.supa.getLoggedInUser();
    if (userData) {
      console.log(userData.id);
      const userId = await this.supa.getUtilisateurById(userData.id);
      const userIdData = userId.data;

      if (userIdData) {
        console.log(userIdData);
        this.utilisateur = userIdData.map((item: { [x: string]: any }) => ({
          id: item['id'],
          email: item['email'],
          nom: item['nom'],
        }));
        console.log(this.utilisateur.map((item) => item['nom']).join(', '));
      }

      const roleId = await this.supa.getRoleId(userData.id);
      console.log("ici c'est roleId.data", roleId.data);

      if (roleId.data) {
        roleId.data.forEach(async (item) => {
          console.log('ID du rôle : ', item.id);
          this.idRole = item.id;
          console.log(this.idRole);
          const userRole = await this.supa.getRoleById(this.idRole);
          console.log(userRole.data);
          if (userRole.data) {
            this.role = userRole.data.map((item: { [x: string]: any }) => ({
              id: item['id'],
              role: item['role'],
            }));
            console.log(this.role.map((item) => item['role']).join(', '));
          }
        });
      } else {
        throw new Error('Aucune donnée utilisateur disponible.');
      }
    }
  } */


  /* this.myFormGroup.setValue({
        formControlName1: myValue1, 
        formControlName2: myValue2
      }); */

      //this.form.get(<formControlName>).setValue(<newValue>);

      //this.profilForm.nom.value = this.utilisateur['nom'];

      /*
      nom: new FormControl(this.utilisateur['nom']);
      this.profilNom.nom.value = this.utilisateur['nom']; 
       */



      /*  this.profilForm = new FormGroup({
        nom: new FormControl(this.utilisateur.map((item) => item['nom'])[0]),
        prenom: new FormControl(
          this.utilisateur.map((item) => item['prenom'])[0]
        ),
        email: new FormControl(
          this.utilisateur.map((item) => item['email'])[0]
        ),
        telephone: new FormControl(
          this.utilisateur.map((item) => item['telephone'])[0]
        ),
      }); */

       //this.nom = this.utilisateur[0]?.nom;
       //this.prenom = this.utilisateur[0]?.prenom ?? ''; // Utilisez le "?" pour accéder à "prenom" en toute sécurité au cas ou il serait null
       //this.telephone = this.utilisateur[0]?.telephone ?? null; // ?? signifie en cas de valeur null
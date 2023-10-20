import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
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
  providers: [ConfirmationService, MessageService],
})
export class ProfilComponent implements OnInit {
  utilisateur: UtilisateurI[] = [];
  role: RoleData[] = [];

  idRole!: string; // Utiliser dans la méthode getUserProfil()
  rolesConcatenated: string = ''; // Utiliser dans la méthode getUserProfil() pour afficher les rôles dans le front-end

  profilForm!: FormGroup;

  value: string | undefined;

  constructor(
    public supa: SupabaseService,
    public users: UsersService,
    private formbuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.supa.getLoggedInUser();
    this.getUserProfil();

    this.profilForm = this.formbuilder.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]],
    });
  }

  async getUserProfil() {
    try {
      const userData = await this.supa.getLoggedInUser();
      if (!userData) {
        throw new Error('Aucune donnée utilisateur disponible.');
      }
      //console.log(userData.id);

      const userIdData = (await this.supa.getUtilisateurById(userData.id)).data;
      if (userIdData) {
        //console.log(userIdData);
        this.utilisateur = userIdData.map((item: { [x: string]: any }) => ({
          id: item['id'],
          email: item['email'],
          nom: item['nom'],
          prenom: item['prenom'],
          telephone: item['telephone'],
        }));

        //console.log("Nom d'utilisateur", this.utilisateur.map((item) => item['nom']).join(', '));
      }

      this.profilForm = new FormGroup({
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
      });      

      const roleIdData = (await this.supa.getRoleId(userData.id)).data;
      //console.log("ici c'est roleId.data", roleIdData);

      if (roleIdData) {
        for (const item of roleIdData) {
          console.log('ID du rôle : ', item.idRole);
          this.idRole = item.idRole;
          console.log('this.idRole : ', this.idRole);

          const userRoleData = (await this.supa.getRoleById(this.idRole)).data;
          //console.log(userRoleData);

          if (userRoleData) {
            this.role = this.role.concat(userRoleData);
            console.log(this.role.map((item) => item['role']).join(', '));
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

  // Méthode pour mettre à jour le profil - utilisé dans le formulaire
  async onSubmitForm() {
    console.log(this.profilForm.value);
    try {
      const userData = await this.supa.getLoggedInUser();

      if (!userData) {
        throw new Error('Aucune donnée utilisateur disponible.');
      }

      console.log('le submit', userData.id);
      const update = await this.supa.updateProfil(
        userData.id,
        this.profilForm.value
      );
      return update;
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
    }
  }

  ConfirmDialog() {
    this.confirmationService.confirm({
      message: 'Etes vous sûr de vouloir enregistrer ces modifications ?',
      header: 'Modifier les informations personnelles',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'You have accepted',
        });
        console.log('Accept a été appelé');
        this.onSubmitForm()
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected',
            });
            console.log('Non a été cliqué, la modal sera simplement fermée.');
            window.location.reload();                        
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            console.log("Annulation");
            window.location.reload();                        
            break;
        }
      },
    });
  }

  DeleteDialog() {
    this.confirmationService.confirm({
      message: 'Etes vous sûr de vouloir supprimer votre compte ?',
      header: 'Supprimer le compte',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'You have accepted',
        });
        this.deleteCompte();
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected',
            });
            console.log('Non a été cliqué, la modal sera simplement fermée.');                                    
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            console.log("Annulation");                                    
            break;
        }
      },
    });
  }

  async deleteCompte() {
    try {
      const userData = await this.supa.getLoggedInUser();
      
      if (!userData) {
        throw new Error('Aucune donnée utilisateur disponible.');
      }
      this.supa.deleteUser(userData.id)
      .then(() => {
        sessionStorage.removeItem('token');
      this.router.navigate(['']);        
      })
      //console.log('deleteCompte de cet Id', userData.id);

    } catch (error) {
      console.error("Erreur méthode deleteCompte : ", error);
    }
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

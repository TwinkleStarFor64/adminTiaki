import { Component, OnInit } from '@angular/core';
import { RoleData, UtilisateurData, UtilisateurI } from 'src/app/partage/modeles/Types';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss'],
})
export class GestionComponent implements OnInit {
  utilisateur: UtilisateurI[] = [];
  authUsers: UtilisateurI[] = [];
  allUsersData: UtilisateurData[] = [];
  selectedUtilisateur!: string;

  constructor(public confirmationService: ConfirmationService, public supa: SupabaseService, messageService: MessageService) { }

  async ngOnInit(): Promise<void> {
    try {
      // Utilisation de Promise.all() pour attendre que toutes les opérations se terminent.
      await Promise.all([
        this.fetchUtilisateur(),
        this.fetchAuthUsers(),
        this.fetchAllUsersWithRoles(),
        this.supa.fetchAttribuerRoles(),
        this.supa.getAllUsersWithRoles(),

      ]);

      // Une fois que toutes les opérations sont terminées, vous pouvez continuer ici.
    } catch (error) {
      console.error("Erreur lors de l'initialisation :", error);
    }
    //this.supa.getRoles();
    //this.supa.listUser();
    //this.supa.getUser();
    //this.supa.deleteUser(); 
  }

  // Utilisation de la méthode getUtilisateur pour fetch toutes les données sur la table public.utilisateur 
  async fetchUtilisateur() {
    const { data, error } = await this.supa.getUtilisateur();
    if (data) {
      this.utilisateur = data.map((item: { [x: string]: any }) => ({
        id: item['id'],
        email: item['email'],
        nom: item['nom']
      }));
      console.log("Méthode fetchUtilisateur", this.utilisateur.map((item) => item['id']).join(', '));
    }
    if (error) {
      console.log(error);
    }
  }

  // Utilisation de la méthode listUser pour fetch toutes les données sur la table auth.users  
  async fetchAuthUsers() {
    try {
      const userData = await this.supa.listUser();
      if (userData) {
        this.authUsers = userData.map((item: { [x: string]: any }) => ({
          id: item['id'],
          email: item['email'],
          nom: item['nom']
        }));
        console.log("Méthode fetchAuthUsers : ", this.authUsers.map((item) => item['email']).join(', '));
      } else {
        throw new Error("Aucune donnée utilisateur disponible.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      throw new Error("Echec de la méthode fetchAuthUsers. Veuillez consulter les logs pour plus d'informations.");
    }
  }


  async fetchAllUsersWithRoles() {
    try {
      const usersWithRolesData: UtilisateurData[] = await this.supa.getAllUsersWithRoles();
      if (usersWithRolesData !== undefined) { // Vérification de nullité
        this.allUsersData = usersWithRolesData.map((item) => ({
          id: item.id,
          email: item.email,
          nom: item.nom,
          roles: item.roles
        }));

        // Afficher les utilisateurs avec leurs emails et rôles dans la console
        this.allUsersData.forEach((user) => {
          const allRoles = user.roles.map((role: RoleData) => role.role).join(', ');
          console.log(`Nom: ${user.nom}, Email: ${user.email}, Rôles: ${allRoles}`);
        });
        return;

      } else {
        throw new Error('Aucune donnée utilisateur et rôles disponibles');
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données rôles et utilisateurs", error);
      throw new Error("Echec de la méthode fetchAllUsersWithRoles. Veuillez consulter les logs pour plus d'informations.");
    }
  }
  getRolesText(user: UtilisateurData): string {
    return user.roles.map((allRole: RoleData) => allRole.role).join(', ');
  }
  
  openDeleteDataModal(user: UtilisateurI) {
    console.log('Ouverture de la modal de suppression pour l\'utilisateur :', user);
    this.confirmationService.confirm({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('Accept a été appelé');
        this.onSelect(user);
      },
      reject: () => {
        console.log('No a été cliqué, la modal sera simplement fermée.');
      }
    });
  }

  async onSelect(users: UtilisateurI): Promise<any> {
    this.selectedUtilisateur = users.id;
    console.log("La méthode onSelect", this.selectedUtilisateur);

    this.supa.deleteUser(this.selectedUtilisateur)
      .then(() => {
        this.fetchAllUsersWithRoles();
      })
      .catch((error) => {
        console.log(error);
      });
  }


  /* async deleteUser(id: string) {
    this.onSelect()
    .subscribe((res) => {
      if (res) {
        this.supa.deleteUser(id)
        .then(() => {
          console.log("delete réussi !");        
        })
        .catch((error) => {
          console.log(error);
        });
      }
    })
  } */
}

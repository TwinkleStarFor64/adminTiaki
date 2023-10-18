import { Component, OnInit,ViewChild } from '@angular/core';
import { RoleData, UtilisateurData, UtilisateurI } from 'src/app/partage/modeles/Types';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { EditUserComponent } from '../template/dialog/edit-user/edit-user.component';
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
  selectedUsers: UtilisateurData[] = [];
  formGroup: FormGroup | undefined;
  nomFiltre: string = '';
  emailFiltre: string = '';
  roleFiltre: string = '';
  filteredUtilisateurs: UtilisateurData[] = [];
  currentPage = 0; 
  sortOrder: 'asc' | 'desc' = 'asc'; // Initialisez avec "asc" pour trier par ordre ascendant par défaut.

  @ViewChild(EditUserComponent, { static: false }) editUserComponent: EditUserComponent | undefined;


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
      this.allUsersData = this.allUsersData.map(user => ({
        ...user,
        selected: false, // Initialisez la propriété 'selected' à false pour chaque utilisateur.
      }));
      this.filteredUtilisateurs = this.allUsersData;


      // Une fois que toutes les opérations sont terminées, vous pouvez continuer ici.
    } catch (error) {
      console.error("Erreur lors de l'initialisation :", error);
    }
  
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
          roles: item.roles,
          selected:false,
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
    this.confirmationService.confirm({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('Accept a été appelé');
        this.onSelect(user);
      },
      reject: () => {
        console.log('Non a été cliqué, la modal sera simplement fermée.');
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

  onFilterChange() {
    this.filteredUtilisateurs = this.filterUsers(this.allUsersData, this.nomFiltre, this.emailFiltre, this.roleFiltre);
  }

  filterUsers(users: UtilisateurData[], nomFiltre: string, emailFiltre: string, roleFiltre: string): UtilisateurData[] {
    return users.filter((user) => {
      // Filtrez les utilisateurs en fonction des critères de recherche
      const nomMatch = nomFiltre ? user.nom.includes(nomFiltre.toLowerCase()) : true;
      const emailMatch = emailFiltre ? user.email.toLowerCase().includes(emailFiltre.toLowerCase()) : true;
      const roleMatch = roleFiltre ? this.getRolesText(user).toLowerCase().includes(roleFiltre.toLowerCase()) : true;
  
      return nomMatch && emailMatch && roleMatch;
    });
  }
  
  
  // rechercher() {
  //   this.filteredUtilisateurs = this.allUsersData.filter((user) => {
  //     const nomMatch = user.nom.toLowerCase().includes(this.nomFiltre.toLowerCase());
  //     const emailMatch = user.email.toLowerCase().includes(this.emailFiltre.toLowerCase());
  //     const roleMatch = user.roles.some((role) =>
  //       role.role.toLowerCase().includes(this.roleFiltre.toLowerCase())
  //     );
  
  //     return nomMatch && emailMatch && roleMatch;
  //   });
  // }

  triUtilisateursParNom() {
    if (this.sortOrder === 'asc') {
      this.filteredUtilisateurs.sort((a, b) => {
        if (a.nom && b.nom) {
          return a.nom.localeCompare(b.nom);
        } else {
          return 0; // Si l'un des noms est null, laissez l'ordre inchangé.
        }
      });
      this.sortOrder = 'desc'; // Change l'ordre de tri à descendant.
    } else {
      this.filteredUtilisateurs.sort((a, b) => {
        if (a.nom && b.nom) {
          return b.nom.localeCompare(a.nom);
        } else {
          return 0; // Si l'un des noms est null, laissez l'ordre inchangé.
        }
      });
      this.sortOrder = 'asc'; // Change l'ordre de tri à ascendant.
    }
  }
  
  
  onUserSelectChange(user: UtilisateurData) {
    if (user.selected) {
      this.selectedUsers.push(user);
    } else {
      const index = this.selectedUsers.indexOf(user);
      if (index !== -1) {
        this.selectedUsers.splice(index, 1);
      }
    }
  }
  async deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer les utilisateurs sélectionnés ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        for (const user of this.selectedUsers) {
          await this.onSelect(user);
          this.removeUserById(user.id); // Retirez l'utilisateur supprimé de la liste
        }
        this.selectedUsers = []; // Réinitialisez la liste des utilisateurs sélectionnés
      },
    });
  }
  
  
  removeUserById(userId: any) {
    const index = this.allUsersData.findIndex(user => user.id === userId);
    if (index !== -1) {
      this.allUsersData.splice(index, 1);
    }
  }
  
  openEditUserModal(user: UtilisateurI) {
    if (this.editUserComponent) {
      this.editUserComponent.userEmail = user.email;
      this.editUserComponent.userName = user.nom;
      this.editUserComponent.showDialog();
    } else {
      console.error('editUserComponent is not defined.');
    }
  }
  

}

import { Component, OnInit} from '@angular/core';
import { UtilisateurI } from 'src/app/partage/modeles/Types';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { ConfirmationService } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { UsersService } from 'src/app/partage/services/users.service';
import { GestionUtilisateursPipe } from 'src/app/pipes/gestion-utilisateurs.pipe';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss'],
  providers: [GestionUtilisateursPipe],
})
export class GestionComponent implements OnInit {
  utilisateur: UtilisateurI[] = [];
  selectedUsers: UtilisateurI[] = [];
  tableauUtilisateurs: UtilisateurI[] = [];
  selectedUtilisateur!: string;
  formGroup: FormGroup | undefined;
  nomFiltre: string = '';
  emailFiltre: string = '';
  roleFiltre: string = '';
  filteredUtilisateurs: UtilisateurI[] = [];
  currentPage = 0;
  sortOrder: 'asc' | 'desc' = 'asc';
  selectedUserForEdit: UtilisateurI | null = null;
  showUserEditSection: boolean = false;
  uniqueRoles: string[] = [];
  displayEditModal: boolean = false;
  allRoles: any;
  selectedRoles: string[] = [];
  private initialRoles: string[] = [];

  constructor(
    public confirmationService: ConfirmationService,
    public supa: SupabaseService,
    public users: UsersService,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.users.fetchListeUtilisateurs(); // Récupérer la liste des utilisateurs
      await Promise.all([
        this.users.fetchAuthUsers(),
        this.users.fetchAllUsersWithRoles(),
        this.supa.fetchAttribuerRoles(),
        this.supa.getAllUsersWithRoles(),
        this.users.fetchRoles(),
        (this.uniqueRoles = this.getUniqueRolesFromUsers()),
      ]);
      this.allRoles = await this.users.fetchRoles();
      this.tableauUtilisateurs = this.users.allUsersData;
    } catch (error) {
      console.error("Erreur lors de l'initialisation :", error);
    }
    this.updateFilteredUsers();
  }

  /**
   * Récupère les rôles uniques à partir de la liste des utilisateurs.
   * Parcourt chaque utilisateur et chaque rôle de l'utilisateur.
   * Si le rôle n'est pas déjà dans la liste de tous les rôles, il est ajouté.
   * Retourne la liste de tous les rôles uniques.
   */

  getUniqueRolesFromUsers(): string[] {
    const allRoles: string[] = [];
    this.users.listeUtilisateurs.forEach((user) => {
      if (user.roles) {
        user.roles.forEach((role) => {
          if (!allRoles.includes(role)) {
            allRoles.push(role);
          }
        });
      }
    });

    return allRoles;
  }
  /**
   * Met à jour la liste des utilisateurs filtrés en fonction des paramètres de filtre actuels.
   * Elle applique les filtres pour le nom, l'email, et le rôle à la liste de tous les utilisateurs.
   */
  updateFilteredUsers() {
    this.filteredUtilisateurs = this.filterUsers(
      this.users.allUsersData,
      this.nomFiltre.toLowerCase(),
      this.emailFiltre.toLowerCase(),
      this.roleFiltre.toLowerCase()
    );
  }

  openDeleteDataModal(user: UtilisateurI) {
    this.confirmationService.confirm({
      accept: () => {
        console.log('Accept a été appelé');
        this.deleteUserById(user);
      },
      reject: () => {
        console.log('Non a été cliqué, la modal sera simplement fermée.');
      },
    });
  }

  //supprimer un utilisateur en fonction de son ID.
  async deleteUserById(users: UtilisateurI): Promise<any> {
    this.selectedUtilisateur = users.id;
    console.log('La méthodedeleteUserById', this.selectedUtilisateur);

    this.supa
      .deleteUser(this.selectedUtilisateur)
      .then(() => {
        this.users.fetchProfil();
      })
      .catch((error) => {
        console.log(error);
      });
  }


  //Methode de tri alphabétique
  triUtilisateursParNom() {
    if (this.sortOrder === 'asc') {
      this.filteredUtilisateurs.sort((a, b) => {
        if (a.nom && b.nom) {
          return a.nom.localeCompare(b.nom);
        } else {
          return 0;
        }
      });
      this.sortOrder = 'desc';
    } else {
      this.filteredUtilisateurs.sort((a, b) => {
        if (a.nom && b.nom) {
          return b.nom.localeCompare(a.nom);
        } else {
          return 0;
        }
      });
      this.sortOrder = 'asc';
    }
  }

  //Methode de selectione des utilisateur avec la checkbox
  onUserSelectChange(user: UtilisateurI) {
    if (user.selected) {
      this.selectedUsers.push(user);
    } else {
      const index = this.selectedUsers.indexOf(user);
      if (index !== -1) {
        this.selectedUsers.splice(index, 1);
      }
    }
  }

  // Methode de suppression utilisateur
  async deleteSelectedUsers() {
    this.confirmationService.confirm({
      message:
        'Êtes-vous sûr de vouloir supprimer les utilisateurs sélectionnés ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        for (const user of this.selectedUsers) {
          this.removeUserById(user.id); // Retirez l'utilisateur supprimé de la liste
        }
        this.selectedUsers = [];
      },
    });
  }
  /** Supprimer un utilisateur de la liste dans le service des utilisateurs */
  removeUserById(userId: any) {
    const index = this.users.listeUtilisateurs.findIndex(
      (user) => user.id === userId
    );
    if (index !== -1) {
      this.users.listeUtilisateurs.splice(index, 1);
    }
  }

  editUser(user: UtilisateurI) {
    this.selectedUserForEdit = {
      id: user.id,
      email: user.email,
      nom: user.nom,
      roles: user.roles ? [...user.roles] : [],
    };
    // Conservez une copie de l'état initial des rôles
    this.initialRoles = [...this.selectedUserForEdit.roles];
  }

/**
 * Met à jour l'utilisateur sélectionné avec les rôles sélectionnés.
 * Si les rôles sélectionnés sont définis et non vides, les rôles de l'utilisateur sont mis à jour.
 * Ensuite, une requête de mise à jour est effectuée vers la base de données.
 * Si la mise à jour réussit, un message de succès est affiché.
 * Sinon, un message d'erreur est affiché.
 * Si les rôles sélectionnés ne sont pas définis ou sont vides, un message d'erreur est affiché.
 */

async updateUser() {
  // Vérifiez si un utilisateur est sélectionné pour l'édition
  if (this.selectedUserForEdit) {
    const selectedRoles = this.selectedUserForEdit.selectedRoles;
    console.log('Roles sélectionnés avant la mise à jour :', selectedRoles);

    // Vérifiez si des rôles sont sélectionnés
    if (selectedRoles && Object.keys(selectedRoles).length > 0) {
      // Filtrer les rôles sélectionnés
      this.selectedUserForEdit.roles = Object.keys(selectedRoles).filter(role => selectedRoles[role]);

      console.log('Utilisateur mis à jour :', this.selectedUserForEdit);

      // Mettre à jour la base de données
      try {
        const selected = this.selectedUserForEdit.selected;
        const data = await this.supa.updateRole(this.selectedUserForEdit, selected !== undefined ? selected : false);
        if (data) {
          console.log('Utilisateur mis à jour avec succès dans la base de données:', data);
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur dans la base de données:", error);
      }
    } else {
      console.error('Les rôles sélectionnés ne sont pas définis ou sont vides.');
    }
  }
}

  // Dans gestion.component.ts
  async onCheckboxChange(user: UtilisateurI, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const role = (event.target as HTMLInputElement).value;
  
    // Mettre à jour le tableau
    const index = this.filteredUtilisateurs.findIndex(u => u.id === user.id);
    if (index !== -1) {
      if (isChecked) {
        // Ajouter le rôle à l'utilisateur si la checkbox est cochée
        this.filteredUtilisateurs[index].roles = this.filteredUtilisateurs[index].roles || [];
        this.filteredUtilisateurs[index].roles.push(role);
      } else {
        // Supprimer le rôle de l'utilisateur si la checkbox est décochée
        this.filteredUtilisateurs[index].roles = this.filteredUtilisateurs[index].roles || [];
        this.filteredUtilisateurs[index].roles = this.filteredUtilisateurs[index].roles.filter(r => r !== role);
      }
    }
  }

  onSave() {
    if (this.selectedUserForEdit) {
      const selectedRoles = this.selectedUserForEdit.selectedRoles
        ? Object.keys(this.selectedUserForEdit.selectedRoles).filter(role => this.selectedUserForEdit && this.selectedUserForEdit.selectedRoles && this.selectedUserForEdit.selectedRoles[role])
        : [];
  
      this.supa.saveRoles(this.selectedUserForEdit.id, selectedRoles)
        .then(() => {
          this.closeEditModal();
          this.users.fetchAllUsersWithRoles();
        })
        .catch(error => {
          console.error('Erreur lors de la sauvegarde des rôles :', error);
        });
    } else {
      console.error('Aucun utilisateur sélectionné pour l\'édition');
    }
  }
  //Methodes pour filtrer par les inputs
  onFilterChange() {
    const nomFiltreLower = this.nomFiltre.toLowerCase();
    const emailFiltreLower = this.emailFiltre.toLowerCase();
    const roleFiltreLower = this.roleFiltre.toLowerCase();

    this.filteredUtilisateurs = this.filterUsers(
      this.users.listeUtilisateurs,
      nomFiltreLower,
      emailFiltreLower,
      roleFiltreLower
    );
    this.updateFilteredUsers();
    console.log(
      'Après filtre - filteredUtilisateurs:',
      this.filteredUtilisateurs
    );
  }

  updateUserRole(role: string, isChecked: boolean): void {
    if (this.selectedUserForEdit?.roles) {
      if (isChecked && !this.selectedUserForEdit.roles.includes(role)) {
        this.selectedUserForEdit.roles.push(role);
      } else if (!isChecked && this.selectedUserForEdit.roles.includes(role)) {
        const index = this.selectedUserForEdit.roles.indexOf(role);
        this.selectedUserForEdit.roles.splice(index, 1);
      }
    }
  }

  /** Ouvrir la modale pour éditer un utilisateur
   * @param user {UtilisateurI} L'utilisateur à éditer
   */
  openEditModal(user: UtilisateurI) {
    console.log('Ouverture de la modal pour :', user);
    this.users.fetchRoles();
    this.editUser(user); // Appelle la méthode pour pré-remplir les données
    this.displayEditModal = true; // Ouvre la modal
  
    // Initialiser les rôles sélectionnés
    this.selectedUserForEdit = {
      id: user.id,
      email: user.email,
      nom: user.nom,
      roles: user.roles ? [...user.roles] : [],
    };
  }



  /** Vérifier les droits */
  getRoleCheckedState(role: string): boolean {
    return !!this.selectedUserForEdit?.selectedRoles?.[role];
  }

  handleUserRoleChange(role: string, event: any): void {
    const isChecked = event.target.checked;

    if (this.selectedUserForEdit) {
      this.updateUserRole(role, isChecked);
    }
  }

  closeEditModal() {
    this.displayEditModal = false;
  }

  onCancel() {
    if (this.selectedUserForEdit) {
      this.selectedUserForEdit.roles = [...this.initialRoles];
    }
  }

  filterUsers(
    users: UtilisateurI[],
    nomFiltre: string,
    emailFiltre: string,
    roleFiltre: string
  ): UtilisateurI[] {
    return users.filter((user) => {
      const nomMatch =
        !nomFiltre || user.nom?.toLowerCase().includes(nomFiltre);
      const emailMatch =
        !emailFiltre || user.email?.toLowerCase().includes(emailFiltre);
      const roleMatch =
        !roleFiltre ||
        user.roles?.some((role) => role.toLowerCase().includes(roleFiltre));
      return nomMatch && emailMatch && roleMatch;
    });
  }

  clearFilters() {
    this.nomFiltre = '';
    this.emailFiltre = '';
    this.roleFiltre = '';
    this.onFilterChange(); // Appeler la méthode de filtrage pour mettre à jour la liste filtrée
  }
}
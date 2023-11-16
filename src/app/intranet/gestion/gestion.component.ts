import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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


  constructor(
    public confirmationService: ConfirmationService,
    public supa: SupabaseService,
    public users: UsersService,
    private cdRef: ChangeDetectorRef
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      await this.users.fetchListeUtilisateurs(); // Récupérer la liste des utilisateurs
      await Promise.all([
        this.users.fetchAuthUsers(),
        this.users.fetchAllUsersWithRoles(),
        this.supa.fetchAttribuerRoles(),
        this.supa.getAllUsersWithRoles(),
        this.users.fetchRoles(),
        this.uniqueRoles = this.getUniqueRolesFromUsers(),
        
      ]);
      this.allRoles = await this.users.fetchRoles();
      this.tableauUtilisateurs = this.users.allUsersData;
    } catch (error) {
      console.error("Erreur lors de l'initialisation :", error);
    }
    this.updateFilteredUsers();
  }



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
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
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
      roles: user.roles ? [...user.roles] : [], // Copie des rôles pour éviter la modification directe du tableau original
      selectedRoles: {}, // Initialisez les rôles sélectionnés (peut être vide si vous ne voulez pas pré-cocher les cases)
    };
  
    if (this.selectedUserForEdit && this.selectedUserForEdit.roles && this.selectedUserForEdit.selectedRoles) {
      for (const role of this.selectedUserForEdit.roles) {
        if (this.selectedUserForEdit.selectedRoles) {
          this.selectedUserForEdit.selectedRoles[role] = true;
        }
      }
    }
  }
  
  
  
  
  updateUser() {
    if (this.selectedUserForEdit) {
      const selectedRoles = this.selectedUserForEdit.selectedRoles;
      console.log('Roles sélectionnés avant la mise à jour :', selectedRoles);
  
      if (selectedRoles && Object.keys(selectedRoles).length > 0) {
        // Filtrer les rôles sélectionnés
        this.selectedUserForEdit.roles = Object.keys(selectedRoles)
          .filter(role => selectedRoles[role]);
  
        console.log('Utilisateur mis à jour :', this.selectedUserForEdit);
      } else {
        console.error('Les rôles sélectionnés ne sont pas définis ou sont vides.');
      }
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
      selectedRoles: {},
    };
  
    if (this.selectedUserForEdit.roles) {
      this.selectedUserForEdit.selectedRoles = this.selectedUserForEdit.selectedRoles || {};
  
      this.allRoles.forEach((role: string) => {
        if (this.selectedUserForEdit?.roles) {
          this.selectedUserForEdit.selectedRoles![role] = this.selectedUserForEdit.roles.includes(role);
        }
      });
    }
  }
  
  
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

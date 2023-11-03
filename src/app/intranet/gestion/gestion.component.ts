import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UtilisateurI,
  RoleData,
} from 'src/app/partage/modeles/Types';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { ConfirmationService } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { EditUserComponent } from '../template/dialog/edit-user/edit-user.component';
import { UsersService } from 'src/app/partage/services/users.service';
import { DonneesMedicalesComponent } from '../template/dialog/donnees-medicales/donnees-medicales.component';
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
  selectedUtilisateur!: string;
  formGroup: FormGroup | undefined;
  nomFiltre: string = '';
  emailFiltre: string = '';
  roleFiltre: string = '';
  filteredUtilisateurs: UtilisateurI[] = [];
  currentPage = 0;
  sortOrder: 'asc' | 'desc' = 'asc';
  selectedUserForEdit: UtilisateurI | null = null;

  @ViewChild(EditUserComponent, { static: false }) editUserComponent:
    | EditUserComponent
    | undefined;
  @ViewChild(DonneesMedicalesComponent, { static: false })
  donneesMedicalComponent: DonneesMedicalesComponent | undefined;

  //Modal édition de l'utilisateur
  openEditModal(user: UtilisateurI, index:number): void {
    // if (editComponent) {
    //   editComponent.email = user.email || '';
    //   editComponent.nom = user.nom || '';
    //   editComponent.prenom = user.prenom || '';
    //   editComponent.showDialog(user);
    // } else {
    //   console.error("Le composant d'édition n'est pas défini.");
    // }
  }

  async openMedModal(user: UtilisateurI) {
    if (user && user.email) {
      if (this.donneesMedicalComponent) {
        this.donneesMedicalComponent.email = user.email;
        this.donneesMedicalComponent.nom = user.nom || '';
        this.donneesMedicalComponent.prenom = user.prenom || '';
        this.donneesMedicalComponent.telephone = user.telephone
          ? String(user.telephone)
          : '';
        this.donneesMedicalComponent.showDialog(user);
      } else {
        console.error(
          "this.donneesMedicalComponent n'est pas défini. Assurez-vous qu'il est correctement initialisé."
        );
      }
    } else {
      console.error(
        "L'objet utilisateur (user) est indéfini ou n'a pas de propriété 'email'."
      );
    }
  }

  constructor(
    public confirmationService: ConfirmationService,
    public supa: SupabaseService,
    public users: UsersService
  ) {}

  async ngOnInit(): Promise<void> {
    this.users.fetchListeUtilisateurs(); // Récupérer la liste des utilisateurs
    try {
      await Promise.all([
        this.users.fetchAuthUsers(),
        this.users.fetchAllUsersWithRoles(),
        this.supa.fetchAttribuerRoles(),
        this.supa.getAllUsersWithRoles(),
        // this.supa.getProfil()
      ]);

      this.users.allUsersData = this.users.allUsersData.map((user) => ({
        ...user,
        selected: false,
      }));
      console.log("aaaahh:", this.users.listeUtilisateurs);
      
      this.filteredUtilisateurs = this.users.listeUtilisateurs;
    } catch (error) {
      console.error("Erreur lors de l'initialisation :", error);
    }
  }

  ngAfterViewInit(user: UtilisateurI): void {
    if (user && user.email) {
      if (this.donneesMedicalComponent) {
        this.donneesMedicalComponent.email = user.email;
        this.donneesMedicalComponent.nom = user.nom || '';
        this.donneesMedicalComponent.prenom = user.prenom || '';
        this.donneesMedicalComponent.telephone = user.telephone
          ? String(user.telephone)
          : '';
        this.donneesMedicalComponent.showDialog(user);
      } else {
        console.error(
          "this.donneesMedicalComponent n'est pas défini. Assurez-vous qu'il est correctement initialisé."
        );
      }
    }
  }

  getRolesText(user: UtilisateurI): string {
    return user.roles!.map((allRole: any) => allRole.role).join(', ');
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
        this.users.fetchAllUsersWithRoles();
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
          //await this.onSelect(user);
          this.removeUserById(user.id); // Retirez l'utilisateur supprimé de la liste
        }
        this.selectedUsers = [];
      },
    });
  }
  /** Supprimer un utilisateur de la liste dans le service des utilisateurs */
  removeUserById(userId: any) {
    const index = this.users.listeUtilisateurs.findIndex((user) => user.id === userId);
    if (index !== -1) {
      this.users.listeUtilisateurs.splice(index, 1);
    }
  }

  //Ouverture de la modal edition
  openEditUserModal(user: UtilisateurI, i:number) {
    this.editUserComponent!.showDialog(user);
    // if (this.editUserComponent) {
    //   this.editUserComponent.email = user.email || '';
    //   this.editUserComponent.nom = user.nom || '';
    //   this.editUserComponent.prenom = user.prenom || '';
    //   this.editUserComponent.showDialog(user);
    // } else {
    //   console.error(
    //     "this.editUserComponent n'est pas défini. Assurez-vous qu'il est correctement initialisé."
    //   );
    // }
  }
  //Methodes pour filtrer par les inputs
  onFilterChange() {
    this.filteredUtilisateurs = this.filterUsers(
      this.users.listeUtilisateurs,
      this.nomFiltre,
      this.emailFiltre,
      this.roleFiltre,  
      );
      console.log('this.allUsersData', this.users.allUsersData);
      console.log('this.nomFiltre', this.nomFiltre);
  }
  
  filterUsers(
    users: UtilisateurI[],
    nomFiltre: string,
    emailFiltre: string,
    roleFiltre: string,

  ): UtilisateurI[] {
    return users.filter((user) => {
      const nomMatch = nomFiltre
        ? user.nom?.toLowerCase().includes(nomFiltre.toLowerCase())
        : true;
      const emailMatch = emailFiltre
        ? user.email?.toLowerCase().includes(emailFiltre.toLowerCase())
        : true;
      const roleMatch = roleFiltre
        ? this.getRolesText(user)?.toLowerCase().includes(roleFiltre.toLowerCase())
        : true;
    
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
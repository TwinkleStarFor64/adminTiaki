import { Injectable, OnInit } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { RoleData, UtilisateurData, UtilisateurI } from '../modeles/Types';

@Injectable({
  providedIn: 'root',
})
export class UsersService implements OnInit {
  allUsersData: UtilisateurData[] = [];
  utilisateur: UtilisateurI[] = [];
  authUsers: UtilisateurI[] = [];
  selectedUsers: UtilisateurData[] = [];
  user!: UtilisateurI;

  

  profil!: UtilisateurI;

  constructor(public supa: SupabaseService) {}

  ngOnInit(): void {
    
  }

  async fetchUtilisateur() {
    const { data, error } = await this.supa.getUtilisateur();
    if (data) {
      this.utilisateur = data.map((item: { [x: string]: any }) => ({
        id: item['id'],
        email: item['email'],
        nom: item['nom'],
      }));
      console.log(
        'Méthode fetchUtilisateur',
        this.utilisateur.map((item) => item['id']).join(', ')
      );
    }
    if (error) {
      console.log(error);
    }
  }
  /*
   * Méthode de récupération des utilisateurs
   */
  async fetchAuthUsers() {
    try {
      const userData = await this.supa.listUser();
      if (userData) {
        this.authUsers = userData.map((item: { [x: string]: any }) => ({
          id: item['id'],
          email: item['email'],
          nom: item['nom'],
        }));
        console.log(
          'Méthode fetchAuthUsers : ',
          this.authUsers.map((item) => item['email']).join(', ')
        );
      } else {
        throw new Error('Aucune donnée utilisateur disponible.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw new Error(
        "Echec de la méthode fetchAuthUsers. Veuillez consulter les logs pour plus d'informations."
      );
    }
  }

  async fetchAllUsersWithRoles() {
    try {
      const usersWithRolesData: UtilisateurData[] =
        await this.supa.getAllUsersWithRoles();
      if (usersWithRolesData !== undefined) {
        // Vérification de nullité
        this.allUsersData = usersWithRolesData.map((item) => ({
          id: item.id,
          email: item.email,
          nom: item.nom,
          roles: item.roles,
          selected: false,
        }));

        // Afficher les utilisateurs avec leurs emails et rôles dans la console
        this.allUsersData.forEach((user) => {
          const allRoles = user.roles
            .map((role: RoleData) => role.role)
            .join(', ');
          console.log(
            `Nom: ${user.nom}, Email: ${user.email}, Rôles: ${allRoles}`
          );
        });
        return;
      } else {
        throw new Error('Aucune donnée utilisateur et rôles disponibles');
      }
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des données rôles et utilisateurs',
        error
      );
      throw new Error(
        "Echec de la méthode fetchAllUsersWithRoles. Veuillez consulter les logs pour plus d'informations."
      );
    }
  }

  async fetchProfil() {
    try {
      // La méthode getProfil() récupére toutes les données utilisateurs et tout les rôles de l'utilisateur authentifié
      const data = await this.supa.getProfil();
      console.log("Data du profil", data);
      if (Array.isArray(data)) {
        this.profil = data[0]['utilisateur'];
        this.profil.roles = [];
        data.forEach((d) => {
          if (!this.profil.roles!.includes(d.roles.role))
            this.profil.roles = this.profil.roles!.concat(d.roles.role);
        });
      } else {
        this.profil = {
          id: data['id'],
          nom: data['nom'],
          prenom: data['prenom'],
          email: data['email'],
          roles: data['role'],
        };
      }
      console.log("Profil", this.profil);
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
    }
  }
}

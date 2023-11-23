import { Injectable, OnInit } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { UtilisateurI } from '../modeles/Types';

@Injectable({
  providedIn: 'root',
})
export class UsersService implements OnInit {
  allUsersData: UtilisateurI[] = [];
  allRolesData: any;
  // utilisateur: UtilisateurI[] = []; //
  listeUtilisateurs: Array<UtilisateurI> = [];
  authUsers: UtilisateurI[] = [];
  selectedUsers: UtilisateurI[] = [];
  user!: UtilisateurI;
  filteredUtilisateurs: UtilisateurI[] = [];
  profil!: UtilisateurI;
  allRoles: any[] = [];
  constructor(public supa: SupabaseService) {}

  ngOnInit(): void {}

  async fetchListeUtilisateurs() {
    const { data, error } = await this.supa.getListeUtilisateurs();
    if (data) {
      this.listeUtilisateurs = data.map((item: { [x: string]: any }) => ({
        id: item['id'],
        email: item['email'],
        nom: item['nom'],
        roles:[""]
      }));
      this.filteredUtilisateurs = this.listeUtilisateurs;
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
          roles:[""]
        }));

        console.log(this.authUsers);
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
  /** Récupérer la liste des types de roles dans la base de données */
  async fetchRoles() {
    try {
      const allRoles: any[] = await this.supa.getRoles();

      if (Array.isArray(allRoles)) {
        const rolesArray = allRoles.map((item: any) => {
          return Object.values(item);
        });

        // console.log('Values:', rolesArray.flat());
        return rolesArray.flat();
      } else {
        throw new Error("Aucune donnée n'a été récupérée pour les rôles.");
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des rôles :', error);
      throw new Error(
        "Impossible de récupérer les rôles. Veuillez consulter les logs pour plus d'informations."
      );
    }
  }
  /** Récupération de la liste des utilisateurs éditables */
  async fetchAllUsersWithRoles() {
      // Remplacez cette ligne par votre logique pour récupérer tous les utilisateurs avec leurs rôles
      await this.supa.getAllUsersWithRoles()
      .then(data => {
        if (Array.isArray(data)) {
          this.allUsersData = data;
      }})
      .catch(er => console.log("Erreur dans le chargement des utilisateurs éditables"));
  }

  
  /** Récupérer le profil dans la base */
  async fetchProfil() {
    try {
      // La méthode getProfil() récupére toutes les données utilisateurs et tout les rôles de l'utilisateur authentifié
      const data = await this.supa.getProfil();
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
      // console.log("Profil", this.profil);
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
    }
  }
  // async createUser(formData: any): Promise<UserCreationResponse | undefined> {

  //   try {
  //     const response = await this.supa.(formData);

  //     if (response) {
  //       const data = response;
  //       console.log('Nouveaux utilisateurs créés :', data);

  //       // Vous pouvez effectuer des actions supplémentaires ici si nécessaire.

  //       return data;
  //     } else {
  //       console.error('Aucune donnée renvoyée lors de la création de l\'utilisateur');
  //       throw new Error('Erreur lors de la création de l\'utilisateur');
  //     }
  //   } catch (error) {
  //     console.error('Erreur lors de la création de l\'utilisateur :', error);
  //     throw error;
  //   }
  // }
}

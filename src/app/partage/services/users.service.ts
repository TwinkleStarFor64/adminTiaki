import { Injectable, OnInit } from '@angular/core';
import { SupabaseService } from './supabase.service';
import {  UtilisateurI } from '../modeles/Types';

@Injectable({
  providedIn: 'root',
})
export class UsersService implements OnInit {
  allUsersData: UtilisateurI[] = [];
  // utilisateur: UtilisateurI[] = []; // 
  listeUtilisateurs:Array<UtilisateurI> = [];
  authUsers: UtilisateurI[] = [];
  selectedUsers: UtilisateurI[] = [];
  user!: UtilisateurI;

  

  profil!: UtilisateurI;

  constructor(public supa: SupabaseService) {}

  ngOnInit(): void {
    
  }

  async fetchListeUtilisateurs() {
    const { data, error } = await this.supa.getListeUtilisateurs();
    if (data) {
      this.listeUtilisateurs = data.map((item: { [x: string]: any }) => ({
        id: item['id'],
        email: item['email'],
        nom: item['nom'],
      }));
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
      const usersWithRolesData: UtilisateurI[] = await this.supa.getAllUsersWithRoles();
      if (usersWithRolesData !== undefined) {
        this.allUsersData = usersWithRolesData.map((item) => ({
          id: item.id,
          email: item.email,
          nom: item.nom,
          roles: item.roles ? item.roles.map((role: any) => role.role) : [], 
          selected: false,
        }));
  
        this.allUsersData.forEach((user) => {
          if (user.roles) {
            const allRoles = user.roles.join(', '); 
          }
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
        console.log("Profil data", data);
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

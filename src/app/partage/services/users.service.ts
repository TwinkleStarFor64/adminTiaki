import { Injectable, OnInit } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { UtilisateurI } from '../modeles/Types';

@Injectable({
  providedIn: 'root',
})
export class UsersService implements OnInit {
  allUsersData: UtilisateurI[] = [];
  allRolesData: any;
  listeUtilisateurs: Array<UtilisateurI> = [];
  listeRoles:Array<string> = [];
  user!: UtilisateurI;
  profil!: UtilisateurI;

  constructor(public supa: SupabaseService) {}

  ngOnInit(): void {}

  async fetchListeUtilisateurs(): Promise<UtilisateurI[]> {
    const { data, error } = await this.supa.getListeUtilisateurs();
    if (data) {
      this.listeUtilisateurs = data;
      // Réduire l'objet roles à une liste de chaînes plutôt que de
      this.listeUtilisateurs.forEach((item:UtilisateurI) => item.roles = item.roles.map((r:any) => r.roles.role));
      console.log('Liste utilisateurs', this.listeUtilisateurs);
      return this.listeUtilisateurs;  // Ajoutez cette ligne
    }
    if (error) {
      console.log(error);
    }
    return [];  // Ajoutez cette ligne pour retourner un tableau vide en cas d'erreur
  }
  /** Récupérer la liste des types de roles dans la base de données */
  async fetchRoles() {
    const { data, error } = await this.supa.getRoles();
    if (data) {
      this.listeRoles = data.map(r => r.role); // Récupérer la liste des roles
    }
    if (error) {
      console.log(error);
    }
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

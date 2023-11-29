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
      //console.log("Data du profil", data); // Data est un tableau contenant plusieurs objets rôles et plusieurs objets utilisateur
      if (Array.isArray(data)) { // Vérifie si la variable data est un tableau en utilisant Array.isArray(data)
        this.profil = data[0]['utilisateur']; // Extrait le premier élément du tableau (data[0]) et récupère la propriété utilisateur
        this.profil.roles = []; // Un tableau vide est attribué à la propriété roles de l'objet profil. Cette étape est nécessaire pour s'assurer que le tableau des rôles est vide avant d'y ajouter des éléments.
        data.forEach((d) => {
          if (!this.profil.roles!.includes(d.roles.role)) // Vérifier si le rôle de l'élément actuel (d.roles.role) n'est pas déjà inclus dans le tableau des rôles
            this.profil.roles = this.profil.roles!.concat(d.roles.role);
        });
      } else { // Si data n'est pas un tableau
        this.profil = {
          id: data['id'],
          nom: data['nom'],
          prenom: data['prenom'],
          email: data['email'],
          roles: data['role'],
        };
      }
      //console.log("Profil", this.profil);
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
    }
  }
}

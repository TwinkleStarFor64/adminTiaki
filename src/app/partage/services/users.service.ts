import { Injectable, OnInit } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { RoleData, UtilisateurData, UtilisateurI } from '../modeles/Types';

@Injectable({
  providedIn: 'root',
})
export class UsersService implements OnInit{
  allUsersData: UtilisateurData[] = [];
  utilisateur: UtilisateurI[] = [];
  authUsers: UtilisateurI[] = [];
  selectedUsers: UtilisateurData[] = [];  
  user!: UtilisateurI;

  userData: any [] = []; // Un tableau d'objets
// Je remplie la variable locale authUserId dans le constructor avec la valeur de authUserId stocker en session
// Le stockage en session de authUserId se fais dans la méthode signIn de supabase.service.ts
  authUserId: string | null; 
  rolesArray: string[] = [];

  constructor(public supa: SupabaseService) { 
    this.authUserId = sessionStorage.getItem('authUserId');
  }

  ngOnInit(): void {
    this.rolesArray = [];
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

  async fetchAuthUserData() {
    try {
    // La méthode getAllData() récupére toutes les données utilisateurs et tout leurs rôles
      const groupData = await this.supa.getAllData();
      console.log("groupData : ", groupData);
    // groupData contient toutes les données de la table attribuerRoles et toutes les données des tables qui lui sont associés avec leur ForeignKeys
      for (const objet of groupData) {
      // objet contient les données de la table utilisateur et de la table roles
        const utilisateurId = objet.utilisateur.id; // Récupérez l'ID de l'utilisateur sur la table utilisateur
        const utilisateurNom = objet.utilisateur.nom;
        const utilisateurPrenom = objet.utilisateur.prenom;
        const role = objet.roles.role; // Récupérez les rôles sur la table rôle      
  
        this.user = {
          id:objet.utilisateur.id,
          nom:objet.utilisateur.nom,
          email:objet.utilisateur.email,
          roles:objet.roles.role
          }       

          const existingUser = this.userData.find(user => user.utilisateurNom === utilisateurNom);
          if (existingUser) {
            existingUser.roles.push(role);
          } else {
            this.userData.push({
              utilisateurNom: utilisateurNom,
              utilisateurPrenom: utilisateurPrenom,
              roles: [role],
            });
          }
          this.rolesArray.push(role);
          console.log("ici c'est rolesArray : ", this.rolesArray.toString()); 

        // Vérifiez si l'ID de l'utilisateur correspond à authUserId (Pour vérifier qu'il est bien authentifié)
        /* if (utilisateurId === this.authUserId) {
        // Vérifiez si l'utilisateur existe déjà dans userData - La méthode .find() parcourt le tableau this.userData
        // Si un utilisateur avec le même nom est trouvé, il est stocké dans la variable existingUser
          const existingUser = this.userData.find(user => user.utilisateurNom === utilisateurNom);
        // Si existingUser existe, j'ajoute le nouveau rôle (role) à la liste des rôles de cet utilisateur avec existingUser.roles.push(role).  
           if (existingUser) {
            existingUser.roles.push(role);
        // Si existingUser n'existe pas, je crée un nouvel objet utilisateur avec les propriétés voulues
        // Ensuite j'ajoute ce nouvel utilisateur au tableau this.userData avec this.userData.push
          } else { 
            this.userData.push({
              utilisateurNom: utilisateurNom,
              utilisateurPrenom: utilisateurPrenom,
              roles: [role],
            });
          } 
          this.rolesArray.push(role);
          console.log("ici c'est rolesArray : ", this.rolesArray.toString());          
        } */
      }  
      console.log("this.user : ", this.user);
      console.log("this.userData", this.userData);      
      
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
    }
  }
  


}

// this.user = this.listeUser.find( u => u.id == this.id);

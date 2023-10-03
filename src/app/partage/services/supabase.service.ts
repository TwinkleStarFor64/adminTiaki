import { Injectable } from '@angular/core';
import {
  AuthSession,
  createClient,
  SupabaseClient
} from '@supabase/supabase-js';
import { environment } from 'src/environments/environement';
import { RoleData, UtilisateurData } from '../modeles/Types';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient; // Instance du client Supabase
  public utilisateurData: UtilisateurData[] = [];
  public roleData: RoleData[] = [];
  _session: AuthSession | null = null; // Session d'authentification

  constructor() { this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey) }

  // Connexion à l'application - Tuto : https://www.youtube.com/watch?v=hPI8OegHPYc
  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  // Récupérer les utilisateurs sur la table public.utilisateur
  async getUtilisateur() {
    const data = await this.supabase.from('utilisateur').select('*');
    console.log("Méthode getUtilisateur", data);
    return data;
  }

  // Récupérer les utilisateurs sur la table auth.users (table d'authentification de supabase)
  async listUser() {
    const response = await this.supabase.auth.admin.listUsers();
    console.log("Méthode listUser - response.data.users", response.data.users);
    return response.data.users; // Retournez les données des utilisateurs  
  }


  async deleteUser() {
    const { data, error } = await this.supabase.auth.admin.deleteUser('b3108489-62d7-45d4-8e02-0096dc12b78b');
    if (data) {
      console.log(data);
    }
    if (error) {
      console.log(error);
    }
  }

  // Récupérer les rôles utilisateurs (Admin, rédacteur, etc..) sur la table roles
  async getRoles() {
    try {
      const { data } = await this.supabase.from('roles').select('*');
      if (data) {
        console.log("Méthode getRoles - Données récupérées :", data);
        return data;
      } else {
        throw new Error("Aucune donnée n'a été récupérée pour les rôles.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des rôles :", error);
      throw new Error("Impossible de récupérer les rôles. Veuillez consulter les logs pour plus d'informations.");
    }
  }

  // Table attribuerRoles contient en tant que Foreign Key l'id de la table roles(int) et l'id de la table utilisateur(uuid)
  async fetchAttribuerRoles() {
    const { data, error } = await this.supabase
      .from('attribuerRoles')
      .select('idRole');
    if (data) console.log("Méthode fetchAttribuerRoles", data);
    if (error) console.log(error);
  }

  // Méthode pour récupérer les utilisateurs et leur rôles
  async getAllUsersWithRoles() {
    // Récupérez uniquement l'email et le nom des utilisateurs depuis la table utilisateur.
    const { data: utilisateursData, error: utilisateursError } = await this.supabase
      .from('utilisateur')
      .select('id,  email, nom'); // Incluez le champ "id" pour l'utilisateur.

    if (utilisateursError) {
      console.error('Erreur lors de la récupération des utilisateurs :', utilisateursError);
      return;
    }

    // Récupérez les rôles associés à chaque utilisateur depuis la table attribuerRoles.
    for (const utilisateur of utilisateursData as UtilisateurData[]) { // Utilisez le type correct - interface UtilisateurData
      const idUtilisateur = utilisateur.id; // Contient l'id des utilisateurs de la table utilisateur
      //console.log("idUtilisateur", idUtilisateur);

      const { data: rolesData, error: rolesError } = await this.supabase
        .from('attribuerRoles')
        .select('idRole')
        .eq('idUtilisateur', idUtilisateur); // Comparaison de l'id de la table avec l'id de la variable
        // rolesData contient la ForeignKey idRole de la table attribuerRoles
        //console.log("rolesData", rolesData);

      if (rolesError) {
        console.error('Erreur lors de la récupération des rôles de l\'utilisateur :', rolesError);
        continue;
      }

      // Récupérez les détails des rôles depuis la table des rôles.
      const idRoles = rolesData.map(entry => entry.idRole);
      // map sur rolesData afin de récupérer toutes les ForeignKeys
      //console.log("idRoles", idRoles);
      const { data: rolesDetailsData, error: rolesDetailsError } = await this.supabase
        .from('roles')
        .select('*')
        .eq('id', idRoles); // Comparaison de la ForeignKey avec les id de la table roles
        // rolesDetailsData contient les résultats de la comparaison au dessus
        //console.log(rolesDetailsData);        

      if (rolesDetailsError) {
        console.error('Erreur lors de la récupération des détails des rôles :', rolesDetailsError);
        continue;
      }

      // Ajoutez les détails des rôles à l'objet utilisateur.
      utilisateur.roles = rolesDetailsData as RoleData[]; // Utilisez le type correct - interface RoleData
      //console.log("utilisateurs.roles ici : ", utilisateur.roles);
    }
    // Les utilisateurs avec email, nom et rôles sont maintenant dans utilisateursData.
    //console.log('Utilisateurs avec email, nom et rôles :', utilisateursData);

    // Pour afficher les rôles, vous pouvez utiliser une boucle ou une fonction map.
    for (const utilisateur of utilisateursData as UtilisateurData[]) { // Utilisez le type correct - interface RoleData
      const roles = utilisateur.roles.map((nomRole: RoleData) => nomRole.role).join(', ');
      console.log(`Rôles de ${utilisateur.nom}: ${roles}`);
    }
  }
}


/* async getUser() {
    const { data, error } = await this.supabase.auth.admin.getUserById('b3108489-62d7-45d4-8e02-0096dc12b78b');
    if (data) {
      console.log("getUser fonction ", data);
    }
    if (error) {
      console.log(error);
    }
  } */
// '3845e166-dd29-47b4-924a-de0a1e50d454' Denver
// 'b3108489-62d7-45d4-8e02-0096dc12b78b' Toto
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
  public utilisateurData : UtilisateurData[] = [];
  public roleData : RoleData[]=[];
  _session: AuthSession | null = null; // Session d'authentification

  constructor() { this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey) }
  
  /* getAuth(){
    const data = this.supabase.auth.signInWithPassword({email:'coucou', password:'leChat'}).then().catch();
    console.log("getAuth", data);    
  } */

  // Connexion à l'application - Tuto : https://www.youtube.com/watch?v=hPI8OegHPYc
  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({email, password});
  }

  async getAdmin() {
    const data = await this.supabase.from('utilisateur').select('*');
    console.log(data);
    return data;    
  }
  
  async getUser() {
    const { data, error } = await this.supabase.auth.admin.getUserById('b3108489-62d7-45d4-8e02-0096dc12b78b');
    if (data) {
      console.log("getUser fonction ", data);
    }
    if (error) {
      console.log(error);      
    }    
  }
// '3845e166-dd29-47b4-924a-de0a1e50d454' Denver
// 'b3108489-62d7-45d4-8e02-0096dc12b78b' Toto

async deleteUser() {
  const { data, error } = await this.supabase.auth.admin.deleteUser('b3108489-62d7-45d4-8e02-0096dc12b78b');
  if (data) {
    console.log(data);    
  }
  if (error) {
    console.log(error);    
  }
}

async getRoles() {
  try {
    const { data } = await this.supabase.from('roles').select('*');

    if (data) {
      console.log("Données récupérées :", data);
      return data;
    } else {
      throw new Error("Aucune donnée n'a été récupérée pour les rôles.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des rôles :", error);
    throw new Error("Impossible de récupérer les rôles. Veuillez consulter les logs pour plus d'informations.");
  }
}

async fetchAttribuerRoles() {
  const { data, error } = await this.supabase
  .from('attribuerRoles')
  .select('idRole');
  if(data)console.log("data attribuerRoles", data);
  if(error)console.log(error);
}

async getAllUsersWithRoles() {
  // Récupérez uniquement l'email et le nom des utilisateurs depuis la table utilisateur.
  const { data: utilisateursData, error: utilisateursError } = await this.supabase
    .from('utilisateur')
    .select('id, email, nom'); // Incluez le champ "id" pour l'utilisateur.
  
  if (utilisateursError) {
    console.error('Erreur lors de la récupération des utilisateurs :', utilisateursError);
    return;
  }
  
  // Récupérez les rôles associés à chaque utilisateur depuis la table attribuerRoles.
  for (const utilisateur of utilisateursData as UtilisateurData[]) {
    const idUtilisateur = utilisateur.id; // Utilisez le champ correct de l'utilisateur.
    const { data: rolesData, error: rolesError } = await this.supabase
      .from('attribuerRoles')
      .select('idRole')
      .eq('idUtilisateur', idUtilisateur);
    
    if (rolesError) {
      console.error('Erreur lors de la récupération des rôles de l\'utilisateur :', rolesError);
      continue;
    }
    
    // Récupérez les détails des rôles depuis la table des rôles.
    const idRoles = rolesData.map(entry => entry.idRole);
    const { data: rolesDetailsData, error: rolesDetailsError } = await this.supabase
      .from('roles')
      .select('*')
      .in('id', idRoles);
    
    if (rolesDetailsError) {
      console.error('Erreur lors de la récupération des détails des rôles :', rolesDetailsError);
      continue;
    }
    
    // Ajoutez les détails des rôles à l'objet utilisateur.
    utilisateur.roles = rolesDetailsData as RoleData[]; // Utilisez le type correct.
  }
  
  // Les utilisateurs avec email, nom et rôles sont maintenant dans utilisateursData.
  console.log('Utilisateurs avec email, nom et rôles :', utilisateursData);

  // Pour afficher les rôles, vous pouvez utiliser une boucle ou une fonction map.
  for (const utilisateur of utilisateursData as UtilisateurData[]) {
    const roles = utilisateur.roles.map(nomRole => nomRole.role).join(', ');
    console.log(`Rôles de ${utilisateur.nom}: ${roles}`);
  }
}


async listUser() {
  const response = await this.supabase.auth.admin.listUsers();
  console.log("ici response.data", response.data.users);
  return response.data.users; // Retournez les données des utilisateurs  
}

 

}






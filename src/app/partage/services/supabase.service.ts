import { Injectable } from '@angular/core';
import { AuthSession, createClient, SupabaseClient, } from '@supabase/supabase-js';
import { environment } from 'src/environments/environement';
import { UserCreationResponse, UtilisateurI } from '../modeles/Types';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient; // Instance du client Supabase
  _session: AuthSession | null = null; // Session d'authentification
  user: any; // Utilisé dans la méthode signIn()
  token!: string; // Utilisé dans la méthode signIn() pour stocker le token de l'utilisateur
  authId!: string; // Utilisé dans la méthode signIn() pour stocker l'id de l'utilisateur
  badEmail = false; // Utilisé dans la méthode resetPasswordBis() - utiliser pour une popup
  badLogin = false; // Utilisé dans la méthode signIn() - utiliser pour une popup - Pas utilisé pour le moment ( optionel)

  tokenDev!: string;

  constructor(private router: Router) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // Connexion à l'application - Tuto : https://www.youtube.com/watch?v=hPI8OegHPYc
  signIn(email: string, password: string): any {
    this.supabase.auth
      .signInWithPassword({ email, password })
      .then((res) => {
        this.user = res.data.user; // La réponse de la méthode avec toutes les données d'un utilisateur
        //console.log("L'id de l'utilisateur authentifié : ", this.user.id);
        if (res.data.user!.role === 'authenticated') {
          // Je vérifie que le rôle et 'authenticated' dans supabase - voir le résultat de console.log(res)
          this.token = res.data.session!.access_token; // Je stock la valeur du token retourné par supabase
          //console.log(this.token);          
          this.authId = res.data.user!.id; // j'attribue à la variable authId l'id de l'utilisateur (après son authentification)
          this.router.navigate(['intranet']);
        }
      })
      .catch((err) => {
        console.log(err);
        this.badLogin = true; // Pour gérer l'affichage d'une popup dans connexion.component.html
        console.log(this.badLogin);
      });
  }

  // Méthode pour reset le mot de passe et vérifier si l'email existe sur la table auth.users - Pas utilisé pour le moment ( optionel)
  async resetPasswordAndCheckEmail(email: string) {
    try {
      // Récupérez la liste des utilisateurs
      const response = await this.supabase.auth.admin.listUsers();
      const users = response.data.users;
      // La méthode find itère sur les éléments du tableau users pour comparer la valeur email (email en paramétre de ma fonction et email des users)
      const checkEmail = users.find((user) => user.email === email);

      if (checkEmail) {
        console.log('email trouvé');
        // Si l'email existe en BDD
        const data = await this.supabase.auth.resetPasswordForEmail(email, {
          redirectTo: '/reset',
        });
        return data;
      } else {
        // L'utilisateur n'existe pas
        console.log('Utilisateur non trouvé');
        this.badEmail = true; // Pour la popup sur recovery.component.html
        return null;
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  // Récupérer son mot de passe en cas de perte - Reset du Password
  async resetPassword(email: string) {
    const data = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: '/reset', //http://localhost:4200/reset
    });
    return data;
  }

  // Méthode pour modifier son MDP - sur la table auth
  async updatePass(newPassword: string) {
    const data = await this.supabase.auth.updateUser({ password: newPassword });
    console.log('méthode updatePass : ', data);
    return data;
  }

  // Récupérer les utilisateurs sur la table public.utilisateur
  async getListeUtilisateurs() {
    return await this.supabase
    .from('utilisateurs')
    .select("*, roles:attribuerRoles!attribuerRoles_idUtilisateur_fkey!inner(roles(role))")
    // .select("*, roles:attribuerRoles!inner(id, roles!inner(role))")
  }

  // Récupérer les utilisateurs sur la table auth.users (table d'authentification de supabase)
  async listUser() {
    const response = await this.supabase.auth.admin.listUsers();
    return response.data.users; // Retournez les données des utilisateurs
  }

  /*
   *Supprimer utilisateur
   */
  async deleteUser(userData: string) {
    // userData servira à comparer à l'id utilisateur
    const { data, error } = await this.supabase.auth.admin.deleteUser(userData);
    if (data) {
      console.log('suppression réussie');
    }
    if (error) {
      console.log(error);
    }
  }

  // Récupérer les rôles utilisateurs (Admin, rédacteur, etc..) sur la table roles
  async getRoles() {
    return await this.supabase.from('roles').select('role');
  }

  // Table attribuerRoles contient en tant que Foreign Key l'id de la table roles(int) et l'id de la table utilisateur(uuid)
  async fetchAttribuerRoles() {
    const { data, error } = await this.supabase
      .from('attribuerRoles')
      .select('idRole');
    if (data) {
      return data;
    }
    if (error) {
      console.error('Erreur lors de la récupération des rôles attribués :', error);
      throw new Error(
        "Impossible de récupérer les rôles attribués. Veuillez consulter les logs pour plus d'informations."
      );
    }
    return null;
  }

async saveNameAndEmail(id: string, nom: string, email: string) {
  const { data, error } = await this.supabase
    .from('utilisateur')
    .update({ nom: nom, email: email })
    .eq('id', id);
  if (data) {
    console.log('update réussie');
  }
  if (error) {
    console.log(error);
  }
}

  async saveRoles(userId: string, roleNames: string[]) {
    if (roleNames && roleNames.length > 0) {
      // Obtenir l'ID de chaque rôle à partir de son nom
      const { data: rolesData, error: rolesError } = await this.supabase
        .from('roles')
        .select('id, role')
        .in('role', roleNames);

      if (rolesError) {
        console.error('Erreur lors de la récupération des IDs des rôles :', rolesError);
        throw rolesError;
      }

      const roles: { [key: string]: number } = rolesData.reduce((obj, role) => ({ ...obj, [role.role]: role.id }), {});

      // Supprimer tous les rôles existants pour l'utilisateur
      await this.supabase
        .from('attribuerRoles')
        .delete()
        .match({ idUtilisateur: userId });

      // Insérez les nouveaux rôles pour l'utilisateur
      await this.supabase
        .from('attribuerRoles')
        .insert(
          roleNames.map(roleName => ({ idUtilisateur: userId, idRole: roles[roleName] }))
        );
    } else {
      console.error(
        'Les rôles sélectionnés ne sont pas définis ou sont vides.'
      );
    }
  }
  /** Mettre à jour un role */
  async updateRole(user: UtilisateurI, roles: string[]) {
    // Récupérer les rôles actuels de l'utilisateur
    const { data: currentRoles, error: fetchError } = await this.supabase
      .from('attribuerRoles')
      .select('idRole')
      .match({ id: user.id });

    if (fetchError) {
      console.error('Erreur lors de la récupération des rôles de l\'utilisateur :', fetchError);
      return null;
    }
    const currentRoleIds = currentRoles.map(role => role.idRole);

    // Trouver les rôles à supprimer et les rôles à ajouter
    const rolesToDelete = currentRoleIds.filter(roleId => !user.roles.includes(roleId));
    const rolesToAdd = user.roles.filter(roleId => !currentRoleIds.includes(roleId));

    // Supprimer les rôles qui ne sont plus nécessaires
    for (const roleId of rolesToDelete) {
      const { error: deleteError } = await this.supabase
        .from('attribuerRoles')
        .delete()
        .match({ id: user.id, idRole: roleId });

      if (deleteError) {
        console.error('Erreur lors de la suppression du rôle de l\'utilisateur :', deleteError);
        return null;
      }
    }

    // Ajouter les nouveaux rôles
    for (const roleId of rolesToAdd) {
      const { error: insertError } = await this.supabase
        .from('attribuerRoles')
        .insert({ id: user.id, idRole: roleId });

      if (insertError) {
        console.error('Erreur lors de l\'ajout du rôle à l\'utilisateur :', insertError);
        return null;
      }
    }

    return user.roles;
  }

  /* ----------------------------- Code pour la page profil utilisateur ---------------------------- */

  // Méthode pour récupérer les données d'un utilisateur identifié (sur la table auth)
  async getLoggedInUser() {
    const { data: { user } } = await this.supabase.auth.getUser();
    // console.log('Méthode getLoggedInUser : ', user);
    return user;
  }

  // Méthode pour update son profil en tant qu'utilisateur (sur la table utilisateurs)
  async updateProfil(
    id: string,
    newEntry: {
      nom: string;
      prenom: string;
      telephone: string;
    }
  ) {
    const { error: updateError } = await this.supabase
      .from('utilisateurs')
      .update(newEntry)
      .eq('id', id);

    if (updateError) {
      console.log(updateError);
    }
  }

  /* --------------------------- Code utilisé dans le service users.service.ts -------------------------- */

  // Update des données utilisateurs sur la page de gestion
  async updateUser(userId: string, updatedUserData: any) {
    try {
      const { data, error } = await this.supabase
        .from('utilisateurs') // Remplacez 'utilisateurs' par le nom de votre table
        .update(updatedUserData)
        .eq('id', userId); // Mettez à jour l'utilisateur avec l'ID spécifié

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Une erreur s'est produite lors de la mise à jour de l'utilisateur :", error);
      throw error;
    }
  }

  async updateUserRoles(userId: string, roles: string[]) {
    try {
      // Supprimez tous les rôles existants pour l'utilisateur
      await this.supabase
        .from('attribuerRoles')
        .delete()
        .eq('idUtilisateur', userId);

      // Insérez les nouveaux rôles pour l'utilisateur
      await this.supabase
        .from('attribuerRoles')
        .insert(
          roles.map(role => ({ idUtilisateur: userId, idRole: role }))
        );
      return { error: null };
    } catch (error) {
      console.error('Erreur lors de la mise à jour des rôles de l\'utilisateur :', error);
      return { error };
    }
  }



  async createUserInTableUtilisateurAuth(formData: any): Promise<UserCreationResponse> {
    try {
      // D'abord, créez l'utilisateur dans la table "auth" (par exemple, pour le mail et le mot de passe)
      const authResponse = await this.supabase
        .from('auth')
        .upsert([formData]);

      if (authResponse.error) {
        console.error('Erreur lors de la création de l\'utilisateur dans la table auth :', authResponse.error);
        throw authResponse.error;
      }

      // Ensuite, créez l'utilisateur dans la table "utilisateur" (par exemple, pour d'autres informations)
      const utilisateurResponse = await this.supabase
        .from('utilisateur')
        .upsert([formData]);

      if (utilisateurResponse.error) {
        console.error('Erreur lors de la création de l\'utilisateur dans la table utilisateur :', utilisateurResponse.error);
        throw utilisateurResponse.error;
      }

      // Vérifiez si les données sont nulles et attribuez une valeur par défaut si nécessaire
      const authData = authResponse.data || [];
      const utilisateurData = utilisateurResponse.data || [];

      return {
        auth: authData,
        utilisateur: utilisateurData
      };
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur :', error);
      throw error;
    }
  }

  async getProfil(): Promise<any[]> {
    try {
      // Sur la table attribuerRoles je select les tables roles et utilisateur grâce à leur id qui sont en ForeignKeys
      // Pour roles je récupére juste la donnée (role) - sur utilisateur je récupére toutes les données (*)
      // Avec .eq je compare l'id à celui obtenu dans authId initialisé dans la méthode signIn
      const { data, error } = await this.supabase
        .from('attribuerRoles')
        .select('roles(role),utilisateurs!attribuerRoles_idUtilisateur_fkey(*)')
        .eq('idUtilisateur', this.authId);

      if (error) {
        console.log(error);
        throw new Error("Une erreur s'est produite lors de la récupération des données.");
      }
      if (data) return data;

      // Si data n'est pas défini, retourner un tableau vide par défaut
      return [];
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
      throw error;
    }
  }


}
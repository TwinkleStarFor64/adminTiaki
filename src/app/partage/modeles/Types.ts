/**
 * @description Interface de l'aside bar
 */
export interface AsideI {
    nom?: string;
    image: string;
    url: string;
}

/**
 * @description Interface des utilisateurs
 */
export interface UtilisateurI {
    id: string;
    email: string;
    nom: string;
    prenom?: string;
    telephone?: string;
    roles: Array<string>;
    selectedRoles?: { [key: string]: boolean };
    selected?: boolean;
  }
  
// export interface UtilisateurData {
//     id: any;
//     email: string;
//     nom: string;
//     roles: RoleData[];
//     selected?: boolean; 
// }

export interface RoleData {
  name: string;
  selected: boolean;
}

export interface UserCreationResponse {
    auth: any[] | undefined; 
    utilisateur: any[] | undefined; 
  }
  
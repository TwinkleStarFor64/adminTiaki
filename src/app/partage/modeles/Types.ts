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
    prenom?:string;
    telephone?:number;
    role?: string;
}

export interface UtilisateurData {
    id: any;
    email: string;
    nom: string;
    roles: RoleData[];
    selected?: boolean; 
}

export interface RoleData {
  id: number;
  role: string;
}

export interface UserCreationResponse {
    auth: any[] | undefined; 
    utilisateur: any[] | undefined; 
  }
  
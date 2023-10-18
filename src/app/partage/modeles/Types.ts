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
    role?: string;
}

export interface UtilisateurBisI {
    id: string;
    email: string;
    nom: string;
    role: RoleData[];
}

export interface UtilisateurData {
    id: any;
    email: string;
    nom: string;
    roles: RoleData[];
}

export interface RoleData {
  id: number;
  role: string;
}


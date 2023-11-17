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
    telephone?:string;
    roles?: Array<string>;
}

export interface UtilisateurData {
    id: any;
    email: string;
    nom: string;
    roles: RoleData[];
    selected: boolean; 
}

export interface RoleData {
  id: number;
  role: string;
}

/* ---------------- Interface pour la nutrition ------------------- */
export interface PlatI {
    id: number;
    nom: string;
    description: string;
    alim_code: number;
    statut?: string;
    reaction?: string;
    idIngredients?: Array<string>;
}

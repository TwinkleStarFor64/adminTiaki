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
    idIngredients?: Array<number>;
}

export interface CiqualI {
    alim_nom_fr: string;
    proteine: number;
    glucides: number;
    lipides: number;
    sucres: number;
    vitamineC: number;
    vitamineB1: number;
    vitamineB2: number;
    vitamineB3: number;
    vitamineB5: number;
    magnesium: number;
    potassium: number;
    cuivre: number;
    manganese: number;
    [key: string]: number | string; // Signature d'index
}

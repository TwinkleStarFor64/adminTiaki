export interface LienI {
  id: number;
  titre: string;
  url: string;
  description?: string;
  cible?: '_self' | '_blank'
}

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

export interface UserCreationResponse {
  auth: any[] | undefined; 
  utilisateur: any[] | undefined; 
}

/* ---------------- Interface pour la nutrition ------------------- */
export interface PlatI {
  id: number;
  titre: string;
  description: string;
  alim_code: number | null;
  statut?: string;
  reaction?: string;
  ingredients?: Array<number>;
  qualites?: string; 
  astuces?: string;
  nbPersonnes?: number;    
  //types:PlatE
}

export interface MenuI {
  id: number;
  titre: string;
  description: string;
  plats?: Array<number>;
  statut?:MenuE ;
  reaction?: string;
}

export interface CiqualI {
  //alim_code: number,
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
  [key: string]: number | string; // Pour la méthode calculateTotals() qui crée un objet de type clé et valeur - Variable totals dans nutrition.service
}

export interface RegimesI {
  id: number;
  titre: string;
  description?: string;
  type?: string;
}

export interface PlatTypeI {
  id: number;
  type: string;
}

export interface AllergeneI {
  id: number;
  titre: string;
  description?: string;
  type: 'ingredient' | 'nutriment'
}



export interface NutriProgrammeI {
  id: number;
  titre: string;
  description?: string;
  statut: -1 | 0 | 1;
}
/* -------------- ENUM --------------------- */

export enum StatutE {
  valide = '1',
  invalide = '0',
  enAttente = '-1'
}

export interface NutrimentI {
  id: number;
  titre: string;
  quantite: string;
  represente?: string;
  reaction?: string;
  mesure: MesuresE;
}

export enum MesureE{
  mcg ='',
  gr ='',
  kg=''
}

export enum MenuE {
  valide = '1',
  invalide = '0',
  enAttente = '-1'
}

export enum PlatE {
petitDej = 'petit déjeuner',
encas = 'encas',
dejeuner = 'déjeuner',
gouter = 'goûter',
diner= 'diner'
}

export enum MesuresE {
mgr = 'mgr',
gr = 'gr',
kgs = 'kgs'
}


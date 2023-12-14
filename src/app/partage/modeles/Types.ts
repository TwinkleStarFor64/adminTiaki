/** TYPAGE DE LA PARTIE NUTRITION */
export interface MenuI {
  id: number;
  titre: string;
  description?: string;
  plats: Array<number>;
  regimes?:Array<RegimeI>;
  programmes?:Array<NutriProgrammeI>;
  statut?: -1 | 0 | 1;
}
export interface NutriProgrammeI{
  id: number;
  titre: string;
  description?: string;
  statut: -1 | 0 | 1;
}
export interface PlatI {
  id: number;
  titre: string;
  description: string;
  alim_code: number | null;
  statut?: string;
  reaction?: string;
  ingredients?: Array<number>;
  //types:PlatE
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
  [key: string]: number | string; // Pour la méthode calculateTotals() qui crée un objet de type clé et valeur - Variable totals dans nutrition.service
}
export interface IngredientI{
  id:number;
  titre:string;
  alim_code:string;
  quantite:number;
  mesure:MesuresE;
}
export interface NutrimentI{
  id:number;
  titre:string;
  quantite:number;
  mesure:MesuresE;
}
export interface AllergeneI{
  id:number;
  titre:string;
  description?:string;
  type:'ingredient' | 'nutriment'
}
export interface RegimeI{
  id:number;
  titre:string;
  description?:string;
  type?:string
}
/** TYPE OPTO */
export interface ExerciceI {
  id:number;
  titre: string;
  intro?:string;
  description: string;
  duree: number;
  media?: MediaI;
  editeurs?:Array<UtilisateurI>;
  materiels?: Array<MaterielI>;
}
export interface ExoPogrammeI extends ExerciceI {
  exercices:Array<ExerciceI>;
}
export interface AsideI {
  nom?: string;
  image: string;
  url: string;
}
//Interface de la page Journal
export interface JournalI {
  id: number;
  date: string;
  objet: string;
  description?: string;
  notes?: Array<string>;
  groupeEvenement: { // Qu'est ce que c'est ?
    id: number;

  };
  linkedJournals?: JournalI[];
}
// Interface Message
export interface MessageI {
  id: number;
  date: string;
  therapeutes: Array<TherapeuteI>;
  activite: string;
  objet: string;
  echange: string;
  groupeMessage: {
    id: number;
  };
  linkedMessage?: MessageI[];
}
export interface EventI{
  date: number;
  titre: string;
  note?:string;
  observations?: string;
  importance?:ImportanceE;
  idMedecin?:number;
  idMenu?:number;
}
// Interface de la page journal pour les réalisations
export interface RealisationI {
  nom: string;
}
//Interface de la page d'accueil Nutrition
export interface NutritionI {
  id:number;
  title: string;
  text: string;
  button: string;
  image: string;
  url: string;
}
export interface MessageJournalI {
  severity: string;
  summary: string;
  detail: string;
}
// Interface pour les cards de l'accueil
export interface AccueilI {
  id:number;
  titre:string;
  description:string;
  bouton:string;
  image:string;
  url:string;
}
export interface AccueilModulesI {
  id?:number;
  titre:string;
  description:string;
  bouton:string;
  image:string;
  url:string;
}
// Interface pour la page profil(exemple)
export interface UtilisateurI {
  id:number;
  nom: string;
  prenom: string;
  dateNaissance?: number | string | Date;
  email: string;
  telephone?:string;
  mobile?:string;
  adresse?: string;
  ville?:string;
  codePostal?:number | string;
  avatar?:string;
  selected?:boolean;
  roles: Array<string>;
  selectedRoles?: { [key: string]: boolean };
}

export interface RolesI{
  id:number;
  role:string;
}

export enum RolesE {
  anonyme = 'anonyme',
  lambda = 'lambda',
  admin = 'admin',
  redacteur = 'redacteur',
  opto = 'opto',
  nutri= 'nutri',
  super= 'super',
  kine= 'kine',
}

export interface UserCreationResponse {
  auth: any[] | undefined; 
  utilisateur: any[] | undefined; 
}


export interface AidantI extends UtilisateurI{
  idAidant:number;
  cheris:Array<CheriI>;
  therapeutes:Array<TherapeuteI>;
}
export interface CheriI extends UtilisateurI{
  idCheri:number;
}
export interface TherapeuteI extends UtilisateurI{
  idTerapeute:number;
  prenom:string;
  adresse?:string;
  ville?:string;
  codePostal?:number;
  telephone?:string;
  mobile?:string;
  specialites:Array<string>;
  type:TypeTherapeute;
  notes?:Array<string>;
}


/** INTERFACES POUR LA COMMUNAUTE */
export interface CommentaireI {
  id: number;
  aidant:number;
  contenu?:string;
  statut?: -1 | 0 | 1;
  date?:number;
  parent?:number;
}
export interface EvalI extends CommentaireI{
  etoiles:number;
}
export interface NoteI{
  id:number;
  idUtilisateur:number;
  titre:string;
  contenu:string;
}
/** NAVIGATIONS */
export interface NavI {
  image: string;
  titre: string;
  info: string;
  lien: string;
  url: string;
  active: boolean;
  activeUrl?: string;
}
// Interface bottomBar Tableau de bord & Profil
export interface NavTableau {
  titre: string;
  firstInfo: string;
  secondInfo: string;
}
export interface OrganismeI {
  id: number;
  titre:string;
  type:string;
}
// Lister des matéries
export interface MaterielI{
  id:string;
  titre:string;
  description?:string;
  media?:MediaI;
  commentaire?:string;
}
export interface LienI{
  id:number;
  titre:string;
  url:string;
  description?:string;
  cible?:'_self' | '_blank'
}
// Ajouter un média aux autres types
export interface MediaI{
  id?:number;
  titre:string;
  url:string;
  description?:string;
  auteur?:string;
  type?: 'image' | 'video' | 'audio'
}
export interface ParamsI{
  app:Array<ParamI>;
}
// Paramètres
export interface ParamI{
  titre:string;
  description:string;
  url:string;
}

export enum NoteE {
  commentaire = "Commentaire",
  note = "Note",
  eval = "Evaluation"
}
export enum TypeTherapeute{
  infirmiere = 'infirmiere',
  medecin = 'generaliste',
  specialiste = 'specialiste',
  therapeute = 'therapeute'
}
export enum ImportanceE{
  faible = 'Faible',
  moyenne = 'Moyenne',
  forte = 'Forte',
  critique = 'Critique'
}

/** POUBELLE */
export interface EchangeI {
  nom: string;
  message: string;
}
export interface TableauEnCoursI {
  exerciceEnCours: string;
  progressionOpto: string;
  progressionNutri: string;
}
export interface TableauBordHistoriqueI {
  histoNutri: string;
  histoKine: string;
  histoOpto: string;
  active: boolean;
}
export interface TableauBordTherapeuteI {
  medecinNutri: string;
  general: string;
  medecinOpto: string;
  active: boolean;
}
export interface TableauBordProblemeI {
  problemeNutri: string;
  problemeKine: string;
  problemeOpto: string;
  active: boolean;
}
export interface TableauReussiteI {
  totalExercice: string;
  exerciceOptoReussi: string;
  exerciceKineReussi: string;
  repasNutri: string;
}
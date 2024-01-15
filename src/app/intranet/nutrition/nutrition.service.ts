import { Injectable, OnInit } from '@angular/core';
import { AllergeneI, CiqualI, LienI, MenuI, NutriProgrammeI, NutrimentI, PlatI, PlatTypeI, RegimesI } from 'src/app/partage/modeles/Types';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { AuthSession, createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environement';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NutritionService {
  private supabase: SupabaseClient; // Instance du client Supabase
  _session: AuthSession | null = null; // Session d'authentification Supabase

  nutriments: NutrimentI[] = [];
  menus: MenuI[] = [];
  plats: PlatI[] = [];
  ciqual: CiqualI[] = [];
  ciqualJSON: CiqualI[] = [];
  regimes: RegimesI[] = [];
  platsTypes: PlatTypeI[] = [];
  allergenes: AllergeneI[] = [];
  nutriments: NutrimentI[] = [];
  liens: LienI[] = [];
  nutriProgrammes : NutriProgrammeI[] = [];

  mappedIngredients: any[] = []; // Utilisé dans fetchCiqual()

  totals: { [key: string]: number } = {}; // Objet pour stocker tous les totaux - Les crochets {} sont utilisés pour définir un objet
  // totals est un objet qui peut avoir des clés(key) de type string (par exemple, 'proteine', 'glucides', 'lipides', etc.)
  // et des valeurs associées de type number

  listePlats: any[] = [];

  pageIngredients: number = 1; // Comme ci-dessus mais pour la liste d'ingrédients
  pagePlats: number = 1;

  filtre: string = ''; // Ce qui va servir à filtrer le tableau des ingrédients - utiliser dans le ngModel affichant la liste des plats 
  flitrePlats: string = ''; // Utiliser dans le ngModel affichant la liste des plats - Filtre de recherche

  constructor(public supa: SupabaseService, public http: HttpClient) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

// Méthode utiliser dans l'input de recherche d'ingrédients afin de le réinitialiser
// Si l'input et vide ou pas vide la premiére page (pageIngredients) est défini à 1 afin de retrouver l'affichage initial
onFilterChange() {
  if (this.filtre === '' || this.filtre != '') {
    this.pageIngredients = 1;
  }

  onFilterChangePlats() {
    if (this.flitrePlats === '' || this.flitrePlats != '') {
      this.pagePlats = 1;
    }
  }

// ---------------------Méthode pour fetch les plats et gérer leur affichage en HTML---------------------------
  async fetchPlats(): Promise<any> {
    try {
      const platData = await this.getPlats(); // Appelle la méthode getPlats ci-dessous
      if (platData) {
        //console.log("Data de fetchPlats : ",platData);      
        //Ici, nous utilisons la méthode map pour créer un nouveau tableau de plats à partir de data.
        //Chaque élément de data est représenté par l'objet { [x: string]: any; }, que nous convertissons en un objet PlatI en utilisant les propriétés nécessaires.
        this.plats = platData.map((item: { [x: string]: any }) => ({
          id: item['id'],
          titre: item['titre'],
          description: item['description'],
          alim_code: item['alim_code'],
          ingredients: item['ingredients'],
          qualites: item['qualites'],
          astuces: item['astuces'],
          nbPersonnes: item['nbPersonnes'],          
        }));
        //console.log(this.plats.map((item) => item['titre']));
        return this.plats;
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite sur la méthode fetchPlats :",
        error
      );
    }
  }

// ----------------------Méthode pour récupérer tout les plats sur la table Plats de supabase-------------------
  async getPlats() {
    const { data, error } = await this.supabase.from('plats').select('*');
    if (error) {
      console.log('Erreur de la méthode getPlats : ', error);
    }
    if (data) {
      console.log('Data de la méthode getPlats : ', data);
      return data;
    } else {
      return [];
    }
  }

// -------------------------Méthode pour supprimer un plat-------------------------------------
  async deletePlatSupabase(id: number) {
    // id récupérer sur la méthode deletePlat de nutrition.component
    const { error: deleteError } = await this.supabase
      .from('plats')
      .delete()
      .eq('id', id);
    if (deleteError) {
      console.log('Erreur de suppression de plat', deleteError);
    }
  }

// ----------------------- Méthode pour récupérer la table ciqual JSON ------------------------------------------
  getCiqualJSON() {
    this.http.get<CiqualI[]>('assets/data/ciqual.json').subscribe(
      {
        next: (res) => (this.ciqualJSON = res),
        error: (err) => console.log(err),
        complete: () => console.log(this.ciqualJSON),        
      }
    );
    return this.ciqualJSON;
  }

//------------------------ Méthode pour récupérer TOUTE la table ciqual sur Supabase ------------------------------------------
  async getAllCiqual(): Promise<void> {
    const { data: ciqualBDD, error: ciqualError } = await this.supabase
      .from('ciqualAnses')
      .select('*');
    if (ciqualError) {
      console.log('Erreur de la méthode getAllCiqual : ', ciqualError);
    }
    if (ciqualBDD) {
      // J'attribue à la variable ciqual de type CiqualI le résultat de ciqualBDD - je peux maintenant utiliser ciqual dans d'autres méthodes
      this.ciqual = ciqualBDD;
    }
  }

// ---------------------Méthode pour fetch les ingrédients sur la table ciqualAnses et gérer leur affichage en HTML--------------------------- 
// ids correspond au tableau idIngredients sur la table plats (supabase) - attribuer via onSelectPlat sur plats.component
  async fetchCiqual(ids: Array<number> | undefined): Promise<any> { 
    if (!ids) {  
    // Si pas d'id en paramétres return tableau vide - évite un message d'erreur si je clique sur un plat ne contenant pas idIngredients
      return []
    }
    const listeIngredients = ids.map((id) => this.ciqual.find((ing) => ing['alim_code'] == id));
    if (listeIngredients.length > 0) {
      // Utilisez map pour transformer chaque élément de listeIngredients
      this.mappedIngredients = listeIngredients.map((item) => ({
        alim_nom_fr: item!['alim_nom_fr'],
        // Ci-dessous avec parseFloat je convertis une string en number (données de type texte en BDD)
        // Avec .replace(',', '.')) || 0 - Je remplace le . par une , - Si j'ai autre chose qu'un number en BDD la valeur par défaut est 0
        proteine: parseFloat(String(item!['Protéines, N x 6.25 (g/100 g)']).replace(',', '.')) || 0,
        glucides: parseFloat(String(item!['Glucides (g/100 g)']).replace(',', '.')) || 0,
        lipides: parseFloat(String(item!['Lipides (g/100 g)']).replace(',', '.')) || 0,
        sucres: parseFloat(String(item!['Sucres (g/100 g)']).replace(',', '.')) || 0,
        vitamineC: parseFloat(String(item!['Vitamine C (mg/100 g)']).replace(',', '.')) || 0,
        vitamineB1: parseFloat(String(item!['Vitamine B1 ou Thiamine (mg/100 g)']).replace(',', '.')) || 0,
        vitamineB2: parseFloat(String(item!['Vitamine B2 ou Riboflavine (mg/100 g)']).replace(',', '.')) || 0,
        vitamineB3: parseFloat(String(item!['Vitamine B3 ou PP ou Niacine (mg/100 g)']).replace(',', '.')) || 0,
        vitamineB5: parseFloat(String(item!['Vitamine B5 ou Acide pantothénique (mg/100 g)']).replace(',', '.')) || 0,
        magnesium: parseFloat(String(item!['Magnésium (mg/100 g)']).replace(',', '.')) || 0,
        potassium: parseFloat(String(item!['Potassium (mg/100 g)']).replace(',', '.')) || 0,
        cuivre: parseFloat(String(item!['Cuivre (mg/100 g)']).replace(',', '.')) || 0,
        manganese: parseFloat(String(item!['Manganèse (mg/100 g)']).replace(',', '.')) || 0,
      }));
      this.calculateTotals(); // Après le map je fais appelle à cette méthode pour additioner les valeurs des items définis au dessus
      //console.log('Ciqual traité, mappé', this.ciqual);
      //console.log(this.mappedIngredients.map((item) => item.proteine));    
      return this.mappedIngredients;
    } else {
      console.log('Pas de ciqual !');
      return [];
    }
  }
//-------------------------------- Méthode pour calculer les totaux ------------------------------------------
  calculateTotals() {
    // Ci-dessous je récupére dans numericProperties le nom des items après le map de fetchCiqual
    const numericProperties = [
      'proteine',
      'glucides',
      'lipides',
      'sucres',
      'vitamineC',
      'vitamineB1',
      'vitamineB2',
      'vitamineB3',
      'vitamineB5',
      'magnesium',
      'potassium',
      'cuivre',
      'manganese',
    ];
    for (const property of numericProperties) {
      // J'utilise la variable totals qui défini un objet avec clé et valeur
      this.totals[property] = this.mappedIngredients.reduce((sum, item) => sum + (Number(item[property]) || 0), 0);
      // item représente un des items (par ex: proteine) - sum et l'addition de cet item à chaque itération
      // L'addition est faite ici : sum + (Number(item[property]) || 0) - Number(...) convertit cette valeur en nombre.
      // Si la conversion échoue (si la valeur est null ou undefined), cela renvoie NaN (Not a Number) - Dans ce cas || 0 renvoie 0
      // 0 à la fin de reduce : C'est la valeur initiale de sum. À la première itération, sum sera égal à 0
    }
    //console.log('Totaux :', this.totals);
  }

//------------------------------- Méthode pour modifier un plat -------------------------------------  
  async updatePlat(id: number, plat: PlatI) {
    const { error: platError } = await this.supabase
      .from('plats')
      .update(plat) // Update de tout l'objet plat qui correspond au type PlatI
      .eq('id', id);
    if (platError) {
      console.log(platError);
    }
  }

  //------------------------------- Méthode pour créer un nouveau plat --------------------------------------
  async createPlat(newEntry: {
    titre: string;
    description: string;
    date?: Date;
    ingredients: Array<number>;
  }) {
    newEntry.date = new Date();
    const { error: createError } = await this.supabase
      .from('plats')
      .insert(newEntry)
    if (createError) {
      console.log(createError);
    }
  }

  // In your NutritionService
  getPlatById(id: number): PlatI | undefined {
    console.log("Plat trouvé : ", this.plats.find(plat => plat.id === id));
    return this.plats.find(plat => plat.id === id);

  }

  /* --------------------------Méthode pour récupérer les menus sur la table menus de supabase--------------------------------*/

  async fetchMenus(): Promise<any> {
    try {
      const menuData = await this.getMenus(); // Appelle la méthode getMenus ci-dessous
      if (menuData) {
        //Ici, nous utilisons la méthode map pour créer un nouveau tableau de plats à partir de data.
        //Chaque élément de data est représenté par l'objet { [x: string]: any; }, que nous convertissons en un objet PlatI en utilisant les propriétés nécessaires.
        this.menus = menuData.map((item: { [x: string]: any }) => ({
          id: item['id'],
          titre: item['titre'],
          description: item['description'],
          statut: item['statut'],
        }));
        console.log(this.menus.map((item) => item['titre']));
        return this.menus;
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite sur la méthode fetchPlats :",
        error
      );
    }
  }

// ----------------------Méthode pour récupérer tout les plats sur la table Menus de supabase-------------------
  async getMenus() {
    const { data, error } = await this.supabase.from('menus').select('*');
    if (error) {
      console.log('Erreur de la méthode getMenus : ', error);
    }
    if (data) {
      console.log('Data de la méthode getMenus: ', data);
      return data;
    } else {
      return [];
    }
  }

// -------------------------Méthode pour supprimer un menu-------------------------------------
  async deleteMenuSupabase(id: number) {
    // id récupérer sur la méthode deletePlat de nutrition.component
    const { error: deleteError } = await this.supabase
      .from('menus')
      .delete()
      .eq('id', id);
    if (deleteError) {
      console.log('Erreur de suppression de menus', deleteError);
    }
  }

//------------------------------- Méthode pour créer un nouveau menu --------------------------------------
async createMenu(newEntry: {
  titre: string;
  description: string;
  date?: Date;
  plats?: Array<number>;
  statut?: string;
  reaction?: string;
}) {
  newEntry.date = new Date();
  const { error: createError } = await this.supabase
    .from('menus')
    .insert(newEntry)
  if (createError) {
    console.log(createError);    
  }  
}

  //------------------------------- Méthode pour modifier un menu -------------------------------------  
  async updateMenu(id: number, menu: MenuI) {
    const { error: platError } = await this.supabase
      .from('menus')
      .update(menu) // Update de tout l'objet menu qui correspond au type MenuI
      .eq('id', id);

    if (platError) {
      console.log(platError);
    }
  }

  async fetchNutriments(): Promise<any> {
    try {
      const nutrimentData = await this.getNutriments(); // Appelle la méthode getNutriments ci-dessous
      if (nutrimentData) {
        this.nutriments = nutrimentData.map((item: { [x: string]: any }) => ({
          id: item['id'],
          titre: item['titre'],
          quantite: item['quantite'],
          represente: item['represente'],
          reaction: item['reaction'],
          mesure: item['mesure'],
        }));
        console.log(this.menus.map((item) => item['titre']));
        return this.menus;
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite sur la méthode fetchPlats :",
        error
      );

//------------------------------- Méthode pour fetch les régimes associer à un plat ---------------------
async getRegimes(idPlats: number): Promise<any> {  
  const { data, error } = await this.supabase
    .from('attribuerRegimes')
    .select('plats!attribuerRegimes_idPlats_fkey(*),regimes!attribuerRegimes_idRegimes_fkey(*)')
    .eq('idPlats', idPlats)
  if (error) {
    console.log('Erreur de la méthode getRegimes : ', error);    
  }  
  if (data) {  
    //console.log('Data de la méthode getRegimes : ', data);
    this.regimes = data.flatMap((item: any) => item['regimes']);        
    const mappedRegimes = this.regimes.map((regime: RegimesI) => ({
      id: regime.id,
      titre: regime.titre,
      description: regime.description,
      type: regime.type,
    }));
    //console.log('Régimes après map : ', mappedRegimes);
    return mappedRegimes;
  } else {
    return [];
  }  
} 

//---------------------------- Méthode pour fetch les types (déjeuner, diner, etc....) associer à un plat ------------------------
async getTypeOfPlats(idPlats: number): Promise<any> {
  const { data, error } = await this.supabase
    .from('attribuerPlatsTypes')
    .select('platsTypes!attribuerPlatsTypes_idType_fkey(*)')
    .eq('idPlat', idPlats)
  if (error) {
    console.log('Erreur de la méthode getTypeOfPlats : ', error);    
  }
  if (data) {
    //console.log('Data de la méthode getTypeOfPlats : ', data);
    this.platsTypes = data.flatMap((item: any) => item['platsTypes']).map((platsTypes : PlatTypeI) => ({
      id: platsTypes.id,
      type: platsTypes.type,
    }))    
    //console.log("Ici this.platsTypes : ", this.platsTypes);    
    return this.platsTypes;
  } else {
    return [];
  }
}

//-------------------------- Méthode pour fetch les allergènes associer à un plat -----------------------------------------------
async getAllergenes(idPlats: number): Promise<any> {
  const { data, error } = await this.supabase
    .from('attribuerAllergenes')
    .select('allergenes!attribuerAllergenes_idAllergenes_fkey(*)')
    .eq('idPlats', idPlats)
  if (error) {
    console.log('Erreur de la méthode getAllergenes', error);    
  }
  if (data) {
    //console.log('Data de la méthode getAllergenes : ', data);
    this.allergenes = data.flatMap((item: any) => item['allergenes']).map((allergenes: AllergeneI) => ({
      id: allergenes.id,
      titre: allergenes.titre,
      description: allergenes.description,
      type: allergenes.type,
    }));
    //console.log("Ici this.allergenes : ", this.allergenes);
    return this.allergenes;    
  } else {
    return [];
  }
}

//---------------------------- Méthode pour fetch les nutriments associer à un plat ---------------------------------------------
async getNutriments(idPlats: number): Promise<any> {
  const { data, error } = await this.supabase
    .from('attribuerNutriments')
    .select('nutriments!attribuerNutriments_idNutriments_fkey(*)')
    .eq('idPlats', idPlats)
  if (error) {
    console.log('Erreur de la méthode getNutriments : ', error);    
  }
  if (data) {
    //console.log('Data de la méthode getNutriments : ', data);    
    this.nutriments = data.flatMap((item: any) => item['nutriments']).map((nutriments: NutrimentI) => ({
      id: nutriments.id,
      titre: nutriments.titre,
      quantite: nutriments.quantite,
      mesure: nutriments.mesure,
    }));
    //console.log("Ici this.nutriments : ", this.nutriments);
    return this.nutriments    
  } else {
    return [];
  }
}

//----------------------------- Méthode pour fetch les liens associer à un plat ---------------------------------------------------
async getLiens(idPlats: number): Promise<any> {
  const { data, error } = await this.supabase
    .from('attribuerLiens')
    .select('liens!attribuerLiens_idLiens_fkey(*)')
    .eq('idPlats', idPlats)
  if (error) {
    console.log('Erreur de la méthode getLiens : ', error);    
  }
  if (data) {
    //console.log('Data de la méthode getLiens : ', data);    
    this.liens = data.flatMap((item: any) => item['liens']).map((liens: LienI) => ({
      id: liens.id,
      titre: liens.titre,
      url: liens.url,
      description: liens.description,
      cible: liens.cible,
    }));
    //console.log("Ici this.liens : ", this.liens);
    return this.liens   
  } else {
    return [];
  }
}

//------------------------------ Méthode pour fetch les programmes de nutrition associer au plat ------------------------------------
async getNutriProgrammes(idPlats: number): Promise<any> {
  const { data, error } = await this.supabase
    .from('attribuerNutriProgrammes')
    .select('nutriProgrammes!attribuerNutriProgrammes_idNutriProgrammes_fkey(*)')
    .eq('idPlats', idPlats)
  if (error) {
    console.log('Erreur de la méthode getNutriProgrammes : ', error);    
  }
  if (data) {
    //console.log('Data de la méthode getNutriProgrammes : ', data);    
    this.nutriProgrammes = data.flatMap((item: any) => item['nutriProgrammes']).map((nutriProgrammes: NutriProgrammeI) => ({
      id: nutriProgrammes.id,
      titre: nutriProgrammes.titre,
      description: nutriProgrammes.description,
      statut: nutriProgrammes.statut,      
    }));
    //console.log("Ici this.nutriProgrammes : ", this.nutriProgrammes);
    return this.nutriProgrammes 
  } else {
    return [];
  }
}

}

    }
  }
  async getNutriments() {
    const { data, error } = await this.supabase.from('nutriments').select('*');
    if (error) {
      console.log('Erreur de la méthode getMenus : ', error);
    }
    if (data) {
      console.log('Data de la méthode getMenus: ', data);
      return data;
    } else {
      return [];
    }
  }
  async deleteNutrimentSupabase(id: number) {
    // id récupérer sur la méthode deletePlat de nutrition.component
    const { error: deleteError } = await this.supabase
      .from('nutriments')
      .delete()
      .eq('id', id);
    if (deleteError) {
      console.log('Erreur de suppression de nutriment', deleteError);
    }
  }
  async updateNutriments(id: number, nutriment: NutrimentI) {
    const { error: platError } = await this.supabase
      .from('nutriments')
      .update(nutriment) // Update de tout l'objet nutriment qui correspond au type NutrimentI  
      .eq('id', id);

    if (platError) {
      console.log(platError);
    }
  }
}





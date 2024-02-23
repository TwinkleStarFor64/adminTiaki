import { Injectable } from '@angular/core';
import { AllergeneI, CiqualI, LienI, MenuI, NutrimentI, NutriProgrammeI, PlatI, PlatTypeI, RegimesI } from 'src/app/partage/modeles/Types';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { AuthSession, createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environement';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from 'src/app/partage/services/utils.service';

@Injectable({
  providedIn: 'root',
})
export class NutritionService {
  private supabase: SupabaseClient; // Instance du client Supabase
  _session: AuthSession | null = null; // Session d'authentification Supabase

  menus: MenuI[] = [];
  plats: PlatI[] = [];
  ciqualJSON: CiqualI[] = [];
  regimes: RegimesI[] = [];
  platsTypes: PlatTypeI[] = [];
  allergenes: AllergeneI[] = [];
  liens: LienI[] = [];
  nutriProgrammes: NutriProgrammeI[] = [];
  nutriments: NutrimentI[] = [];  

  //createPlatId!: number;
  mappedIngredients: any[] = []; // Utilisé dans fetchCiqual()

  totals: { [key: string]: number } = {}; // Objet pour stocker tous les totaux - Les crochets {} sont utilisés pour définir un objet
  // totals est un objet qui peut avoir des clés(key) de type string (par exemple, 'proteine', 'glucides', 'lipides', etc.) et des valeurs associées de type number

  pageIngredients: number = 1; // Comme ci-dessus mais pour la liste d'ingrédients
  pagePlats: number = 1;

  filtre: string = ''; // Ce qui va servir à filtrer le tableau des ingrédients - utiliser dans le ngModel affichant la liste des plats 
  //filtrePlats: string = ''; // Utiliser dans le ngModel affichant la liste des plats - Filtre de recherche

  constructor(public supa: SupabaseService, private http: HttpClient, public utils: UtilsService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Méthode utiliser dans l'input de recherche d'ingrédients afin de le réinitialiser
  // Si l'input et vide ou pas vide la premiére page (pageIngredients) est défini à 1 afin de retrouver l'affichage initial
  onFilterChange() {
    if (this.filtre === '' || this.filtre != '') {
      this.pageIngredients = 1;
    }
  }

  /* onFilterChangePlats() {
    if (this.filtrePlats === '' || this.filtrePlats != '') {
      this.pagePlats = 1;
    }
  } */

  // ---------------------Méthode pour fetch les plats et gérer leur affichage en HTML---------------------------
  async fetchPlats(): Promise<any> {
    try {
      const platData = await this.getPlats(); // Appelle la méthode getPlats ci-dessous
      if (platData) {
        //console.log("Data de fetchPlats : ", platData);
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
          nbpersonnes: item['nbpersonnes'], //nbpersonnes sans P pour correspondre à la colonne en BDD
          statut: item['statut'],
          allergenes: item['allergenes'],
          nutriments: item['nutriments'],
          regimes: item['regimes'],
          types: item['types'],
          liens: item['liens'],
          programmes: item['programmes'],          
        }));
        //console.log("Map des allergènes de fetchPlats : ",this.plats.map((item) => item['allergenes']));
        return this.plats;
      }
    } catch (error) {
      console.error("Une erreur s'est produite sur la méthode fetchPlats :", error);
    }
  }

  //allergenes:attribuerAllergenes_idPlats_fkey(allergenes:attribuerAllergenes_idAllergenes_fkey(*))  
  //allergenes:attribuerAllergenes!attribuerAllergenes_idPlats_fkey(allergenes!idAllergenes(*)),
  //allergenes:allergenes!attribuerAllergenes!attribuerAllergenes_idPlats_fkey(*),
  // ----------------------Méthode pour récupérer tout les plats sur la table Plats de supabase-------------------
  async getPlats() {
    const { data, error } = await this.supabase
      .from('plats')
      .select(`*,
      allergenes:attribuerAllergenes!attribuerAllergenes_idPlats_fkey(enfant:allergenes!idAllergenes(*)),
      nutriments:attribuerNutriments!attribuerNutriments_idPlats_fkey(enfant:nutriments!idNutriments(*)),
      regimes:attribuerRegimes!attribuerRegimes_idPlats_fkey(enfant:regimes!idRegimes(*)),
      types:attribuerPlatsTypes!attribuerPlatsTypes_idPlat_fkey(enfant:platsTypes!idType(*)),
      liens:attribuerLiens!attribuerLiens_idPlats_fkey(enfant:liens!idLiens(*)),
      programmes:attribuerNutriProgrammes_idPlats_fkey(enfant:nutriProgrammes!idNutriProgrammes(*))
    `)
    if (error) {
      console.log('Erreur de la méthode getPlats : ', error);
    }
    if (data) {
      //console.log('Data de la méthode getPlats : ', data);
      return this.utils.flatNestedData(data, 'enfant');
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
        complete: () => {}, // Si besoin de voir le résultat - console.log(this.ciqualJSON) au lieu de {}
      }
    );
    return this.ciqualJSON;
  }

  // ---------------------Méthode pour fetch les ingrédients sur la table ciqualAnses et gérer leur affichage en HTML--------------------------- 
  // ids correspond au tableau idIngredients sur la table plats (supabase) - attribuer via onSelectPlat sur plats.component
  async fetchCiqual(ids: Array<number> | undefined): Promise<any> {
    if (!ids) {
      // Si pas d'id en paramétres return tableau vide - évite un message d'erreur si je clique sur un plat ne contenant pas idIngredients
      return []
    }    
    const listeIngredients = ids.map((id) => this.ciqualJSON.find((ing) => ing['alim_code'] == id));
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
  async updatePlat(updateEntry: {
    id: number;
    titre: string;
    description: string;
    ingredients: Array<number>;
    qualites?: string;
    astuces?: string;
    nbpersonnes?: number;
    statut?: number;
    allergenes?: Array<number>;
    types?: Array<number>;
    regimes?: Array<number>;
    programmes?: Array<number>;
    nutriments?: Array<number>;
    liens?: Array<number>;
  }) {
    const { data: updatePlatData, error: updatePlatError } = await this.supabase.rpc('update_plat', {
      plat_id: updateEntry.id,
      plat_titre: updateEntry.titre,
      plat_description: updateEntry.description,
      plat_ingredients: updateEntry.ingredients,
      plat_qualites: updateEntry.qualites,
      plat_astuces: updateEntry.astuces,
      plat_nbpersonnes: updateEntry.nbpersonnes,
      plat_statut: updateEntry.statut,
      idAllergenes: updateEntry.allergenes,
      idType: updateEntry.types,
      idRegimes: updateEntry.regimes,
      idNutriProgrammes: updateEntry.programmes,
      idNutriments: updateEntry.nutriments,
      idLiens: updateEntry.liens
    });           
    if (updatePlatError) {
      console.log(updatePlatError);
    }
    if (updatePlatData) {
      console.log("Ici updatePlatData : ", updatePlatData);
    }
  }

  //------------------------------- Méthode pour créer un nouveau plat --------------------------------------
  async createPlat(newEntry: {
    id?: number;
    titre: string;
    description: string;
    date?: Date;
    ingredients: Array<number>;
    qualites?: string;
    astuces?: string;
    nbPersonnes?: number;
    statut?: number; 
    allergenes?: Array<number>; 
    types?: Array<number>; 
    regimes?: Array<number>;
    programmes?: Array<number>;
    nutriments?: Array<number>; 
    liens?: Array<number>;
  }) {
    newEntry.date = new Date();    
    //console.log("Valeur de allergenes dans createPlatBis :", newEntry.allergenes);
    // Ci-dessous appelle de la fonction insert_plat contenant le code SQL sur Supabase - Je remplis ces paramètres avec les valeurs de newEntry
      const {data: createData, error: createError } = await this.supabase.rpc('insert_plat', {
        plat_titre: newEntry.titre, 
        plat_description: newEntry.description, 
        plat_date: newEntry.date, 
        plat_ingredients: newEntry.ingredients, 
        plat_qualites: newEntry.qualites ?? null, // Utilisation de ?? en cas de valeur null
        plat_astuces: newEntry.astuces ?? null, 
        plat_nbpersonnes: newEntry.nbPersonnes, 
        plat_statut: newEntry.statut,
        idAllergenes: newEntry.allergenes || [], // Utilisation de || [] en cas de valeur null
        idType: newEntry.types || [],
        idRegimes: newEntry.regimes || [],
        idNutriProgrammes: newEntry.programmes || [],
        idNutriments: newEntry.nutriments || [],
        idLiens: newEntry.liens || [],
      });    
      console.log("createData RPC : ", createData);                 
      if (createError) {
          console.log(createError);              
        }                  
  }

  /* --------------------------Méthode pour récupérer les menus sur la table menus de supabase--------------------------------*/
  async fetchMenus(): Promise<any> {
    try {
      const menuData = await this.getMenus(); // Appelle la méthode getMenus ci-dessous
      if (menuData) {
        console.log("Data de fetchMenus", menuData);        
        //Ici, nous utilisons la méthode map pour créer un nouveau tableau de plats à partir de data.
        //Chaque élément de data est représenté par l'objet { [x: string]: any; }, que nous convertissons en un objet PlatI en utilisant les propriétés nécessaires.
        this.menus = menuData.map((item: { [x: string]: any }) => ({
          id: item['id'],
          titre: item['titre'],
          description: item['description'],
          statut: item['statut'],
          plats: item['plats']
        }));
        console.log(this.menus.map((item) => item['titre']));
        return this.menus;
      }
    } catch (error) {
      console.error("Une erreur s'est produite sur la méthode fetchPlats :", error);
    }
  }

  // ----------------------Méthode pour récupérer tout les plats sur la table Menus de supabase-------------------
  async getMenus() {
    const { data, error } = await this.supabase
    .from('menus')
    .select(`*,
    plats:attribuerPlats!attribuerPlats_idMenus_fkey(enfant:plats!idPlats(*))`    
    );
    if (error) {
      console.log('Erreur de la méthode getMenus : ', error);
    }
    if (data) {
      console.log('Data de la méthode getMenus: ', data);
      return this.utils.flatNestedData(data, 'enfant');
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

  //-------------------------------- Méthode l'interface nutriments --------------------------------------
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
    }
  }

  //-------------------------------- Méthode l'interface nutriments --------------------------------------
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

//-------------------------------- Méthode pour récupérer les types de plats ------------------------
  async getPlatsTypes(): Promise<PlatTypeI[]> {
    const { data, error } = await this.supabase
      .from('platsTypes')
      .select('*');
    if (error) {
      console.log("Erreur de la méthode getPlatsTypes : ", error);      
    }
    if (data) {
      //console.log('Data de la méthode getPlatsTypes : ', data);
      this.platsTypes = data.map((item: { [x: string]: any }) => ({
        id: item['id'],
        type: item['type'],
        description: item['description'],  
      }));
      //console.log(this.platsTypes);      
      return this.platsTypes;
    } else {
      return [];
    }
  }

//------------------------------- Méthode pour récupérer les allergènes -----------------------------------------
async getAllergenes(): Promise<AllergeneI[]> {
  const { data, error } = await this.supabase
    .from('allergenes')
    .select('*');
  if (error) {
    console.log("Erreur de la méthode getAllergenes : ", error);      
  }
  if (data) {
    //console.log('Data de la méthode getAllergenes : ', data);
    this.allergenes = data.map((item: { [x: string]: any }) => ({
      id: item['id'],
      titre: item['titre'],
      description: item['description'],
      type: item['type'],  
      slug: item['slug'],
    }));
    //console.log(this.allergenes);    
    return this.allergenes;
  } else {
    return [];
  }
}

//------------------------------- Méthode pour récupérer les régimes alimentaires -----------------------------------------
async getRegimes(): Promise<RegimesI[]>{
  const { data, error } = await this.supabase
    .from('regimes')
    .select('*');
  if (error) {
    console.log("Erreur de la méthode getRegimes : ", error);      
  }
  if (data) {
    //console.log('Data de la méthode getRegimes : ', data);
    this.regimes = data.map((item: { [x: string]: any }) => ({
      id: item['id'],
      titre: item['titre'],
      description: item['description'],
      type: item['type'],  
    }));
    //console.log(this.regimes);    
    return this.regimes;
  } else {
    return [];
  }
}

//------------------------------- Méthode pour récupérer les programmes alimentaires -----------------------------------------
async getNutriProgrammes(): Promise<NutriProgrammeI[]> {
  const { data, error } = await this.supabase
    .from('nutriProgrammes')
    .select('*');
  if (error) {
    console.log("Erreur de la méthode getNutriProgrammes : ", error);      
  }
  if (data) {
    //console.log('Data de la méthode getNutriProgrammes : ', data);
    this.nutriProgrammes = data.map((item: { [x: string]: any }) => ({
      id: item['id'],
      titre: item['titre'],
      description: item['description'],
      statut: item['statut'],  
    }));
    //console.log(this.nutriProgrammes);    
    return this.nutriProgrammes;
  } else {
    return [];
  }
}

//------------------------------- Méthode pour récupérer les liens -----------------------------------------
async getLiens(): Promise<LienI[]> {
  const { data, error } = await this.supabase
    .from('liens')
    .select('*');
  if (error) {
    console.log("Erreur de la méthode getLiens : ", error);      
  }
  if (data) {
    //console.log('Data de la méthode getLiens : ', data);
    this.liens = data.map((item: { [x: string]: any }) => ({
      id: item['id'],
      titre: item['titre'],
      description: item['description'],
      url: item['url'],
      cible: item['cible'],  
    }));
    //console.log(this.liens);    
    return this.liens;
  } else {
    return [];
  }
}

//------------------------------- Méthode pour récupérer les nutriments -----------------------------------------
async getNutrimentsBis(): Promise<NutrimentI[]> {
  const { data, error } = await this.supabase
    .from('nutriments')
    .select('*');
  if (error) {
    console.log('Erreur de la méthode getNutriments : ', error);
  }
  if (data) {
    //console.log('Data de la méthode getNutriments: ', data);
    this.nutriments = data.map((item: { [x: string]: any }) => ({
      id: item['id'],
      titre: item['titre'],
      quantite: item['quantite'],
      represente: item['represente'],
      //reaction: item['reaction'],
      mesure: item['mesure'],  
    }));
    return data;
  } else {
    return [];
  }
}

  // In your NutritionService
  getPlatById(id: number): PlatI | undefined {
    console.log("Plat trouvé : ", this.plats.find(plat => plat.id === id));
    return this.plats.find(plat => plat.id === id);
  }

}


  //------------------------ Méthode pour récupérer TOUTE la table ciqual sur Supabase - Remplacer par getCiqualJSON ------------------------------------------
/*   async getAllCiqual(): Promise<void> {
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
  } */


/*   async createPlat(newEntry: {
    id?: number;
    titre: string;
    description: string;
    date?: Date;
    ingredients: Array<number>;
    qualites?: string;
    astuces?: string;
    nbPersonnes?: number;
    statut?: number;    
  }, idTypes:number, idAllergene:number) {
    newEntry.date = new Date();    
      const { data: createData, error: createError } = await this.supabase
        .from('plats')
        .insert(newEntry)
        .select()  
      if (createError) {
          console.log(createError);              
        }        
        this.createPlatId = createData![0].id
        //console.log("Ici createData : ", createData![0].id);
        console.log("Ici l'id createPlatId : ", this.createPlatId); 
      const { error:typeError } = await this.supabase
        .from('attribuerPlatsTypes')
        .insert({idPlat: this.createPlatId, idType: idTypes})
        if (typeError) {
          console.log(typeError);          
        }
        //console.log("Ici insert : ", this.createPlatId); 
      const { error:allergeneError} = await this.supabase
        .from('attribuerAllergenes')
        .insert({idPlats: this.createPlatId, idAllergenes: idAllergene})
      if (allergeneError) {
        console.log(allergeneError);        
      }      
  } */
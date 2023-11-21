import { Injectable, OnInit } from '@angular/core';
import { CiqualI, PlatI } from 'src/app/partage/modeles/Types';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { AuthSession, createClient, SupabaseClient, } from '@supabase/supabase-js';
import { environment } from 'src/environments/environement';

@Injectable({
  providedIn: 'root'
})
export class NutritionService implements OnInit {
  private supabase: SupabaseClient; // Instance du client Supabase
  _session: AuthSession | null = null; // Session d'authentification Supabase

  plats: PlatI[] = [];
  ciqual: CiqualI[] = [];

  totals: { [key: string]: number } = {}; // Objet pour stocker tous les totaux - Les crochets {} sont utilisés pour définir un objet
  // totals est un objet qui peut avoir des clés(key) de type string (par exemple, 'proteine', 'glucides', 'lipides', etc.)
  // et des valeurs associées de type number

  listePlats: any[] = [];

  constructor(public supa: SupabaseService) {this.supabase = createClient(environment.supabaseUrl,environment.supabaseKey)}

  async ngOnInit(): Promise<void> {
    //this.fetchPlats();    
  }

// ---------------------Méthode pour fetch les plats et gérer leur affichage en HTML---------------------------
  async fetchPlats(): Promise<any> {
    try {
      const platData = await this.getPlats(); // Appelle la méthode getPlats ci-dessous
      if (platData) {
        //Ici, nous utilisons la méthode map pour créer un nouveau tableau de plats à partir de data.
        //Chaque élément de data est représenté par l'objet { [x: string]: any; }, que nous convertissons en un objet PlatI en utilisant les propriétés nécessaires.
        this.plats = platData.map((item: { [x: string]: any }) => ({
          id: item['id'],
          nom: item['nom'],
          description: item['description'],
          alim_code: item['alim_code'], 
          idIngredients: item['idIngredients']      
        }));
        console.log(this.plats.map((item) => item['nom']));
        return this.plats;
      } 
    } catch (error) {
      console.error("Une erreur s'est produite sur la méthode fetchPlats :", error)
    }   
  }

// ----------------------Méthode pour récupérer tout les plats sur la table Plats de supabase-------------------
  async getPlats() {
    const { data, error } = await this.supabase
      .from('plats')
      .select('*')
    if (error) {
      console.log("Erreur de la méthode getPlats : ",error);      
    }
    if (data) {
      console.log("Data de la méthode getPlats : ", data);
      return data      
    } else {
     return [];      
    }   
  }

// -------------------------Méthode pour supprimer un plat-------------------------------------
  async deletePlatSupabase(id: number) { // id récupérer sur la méthode deletePlat de nutrition.component
    const { error: deleteError } = await this.supabase
      .from('plats')
      .delete()
      .eq('id', id);
    if (deleteError) {
      console.log("Erreur de suppression de plat", deleteError);      
    }
  }

// -----------------------Méthode pour récupérer la table Ciqual-------------------------------
async getCiqual(id: Array<number>) {
  if (!id) { // Si pas d'id en paramétres return tableau vide - évite un message d'erreur si je clique sur un plat ne contenant pas idIngredients
    return [];
  }
  const { data: ciqualData, error: ciqualError } = await this.supabase
    .from('ciqualAnses')
    .select('*')
    .in('alim_code', id) //.in filtre les résultats de la table ciqualAnses où la colonne alim_code correspond à l'une des valeurs dans le tableau id
  if (ciqualError) {
    console.log("Erreur de la méthode getCiqual : ", ciqualError);      
  }
  if (ciqualData) {
    console.log("Data de la méthode getCiqual : ", ciqualData);
    return ciqualData      
  } else {
    return [];      
  }
}

// ---------------------Méthode pour fetch les ingrédients sur la table ciqualAnses et gérer leur affichage en HTML---------------------------
async fetchCiqual(id: Array<number>): Promise<any> { // l'id est fourni durant l'appelle à cette méthode sur nutrition.component
  try {
    const ciqualData = await this.getCiqual(id); // Appelle la méthode getCiqual ci-dessous
    console.log("ciqualData : ", ciqualData);
  // Si ciqualData n'est pas null ou undefined &&  un tableau && longueur du tableau supérieur à 0
    if (ciqualData && Array.isArray(ciqualData) && ciqualData.length > 0) {
      this.ciqual = ciqualData.map((item: { [x: string]: any }) => ({       
        alim_nom_fr: item['alim_nom_fr'], 
  // Ci-dessous avec parseFloat je convertis une string en number (données de type texte en BDD)
  // Avec .replace(',', '.')) || 0 - Je remplace le . par une , - Si j'ai autre chose qu'un number en BDD la valeur par défaut est 0
        proteine: parseFloat(item['Protéines, N x 6.25 (g/100 g)'].replace(',', '.')) || 0,
        glucides: parseFloat(item['Glucides (g/100 g)'].replace(',', '.')) || 0,
        lipides: parseFloat(item['Lipides (g/100 g)'].replace(',', '.')) || 0,
        sucres: parseFloat(item['Sucres (g/100 g)'].replace(',', '.')) || 0,
        vitamineC: parseFloat(item['Vitamine C (mg/100 g)'].replace(',', '.')) || 0,
        vitamineB1: parseFloat(item['Vitamine B1 ou Thiamine (mg/100 g)'].replace(',', '.')) || 0,
        vitamineB2: parseFloat(item['Vitamine B2 ou Riboflavine (mg/100 g)'].replace(',', '.')) || 0,
        vitamineB3: parseFloat(item['Vitamine B3 ou PP ou Niacine (mg/100 g)'].replace(',', '.')) || 0,
        vitamineB5: parseFloat(item['Vitamine B5 ou Acide pantothénique (mg/100 g)'].replace(',', '.')) || 0,
        magnesium: parseFloat(item['Magnésium (mg/100 g)'].replace(',', '.')) || 0,
        potassium: parseFloat(item['Potassium (mg/100 g)'].replace(',', '.')) || 0,
        cuivre: parseFloat(item['Cuivre (mg/100 g)'].replace(',', '.')) || 0,
        manganese: parseFloat(item['Manganèse (mg/100 g)'].replace(',', '.')) || 0,             
      }));      
      this.calculateTotals(); // Après le map je fais appelle à cette méthode pour additioner les valeurs des items définis au dessus     
      console.log(this.ciqual.map((item) => item['alim_nom_fr']));
      return this.ciqual; // ciqual à pour valeur le map et le résultat additioné de calculateTotals();      
    } else {
      console.log("Pas de ciqual !");
      return [];      
    }
  } catch (error) {
    console.error("Une erreur s'est produite sur la méthode fetchCiqual :", error)
  }   
}
//-------------------------------- Méthode pour calculer les totaux ------------------------------------------
calculateTotals() {
// Ci-dessous je récupére dans numericProperties le nom des items après le map de fetchCiqual  
  const numericProperties = ['proteine', 'glucides', 'lipides', 'sucres', 'vitamineC', 'vitamineB1', 'vitamineB2', 'vitamineB3', 'vitamineB5', 'magnesium', 'potassium', 'cuivre', 'manganese'];
  for (const property of numericProperties) {
  // J'utilise la variable totals qui défini un objet avec clé et valeur  
    this.totals[property] = this.ciqual.reduce((sum, item) => sum + (Number(item[property]) || 0), 0);
    // item représente un des items (par ex: proteine) - sum et l'addition de cet item à chaque itération 
    // L'addition est faite ici : sum + (Number(item[property]) || 0) - Number(...) convertit cette valeur en nombre. 
    // Si la conversion échoue (si la valeur est null ou undefined), cela renvoie NaN (Not a Number) - Dans ce cas || 0 renvoie 0
    // 0 à la fin de reduce : C'est la valeur initiale de sum. À la première itération, sum sera égal à 0
  }
  console.log("Totaux :", this.totals);
}

  



  async fetchData() {
    try {     
      this.listePlats = await this.supa.getAttribuerPlats();
      console.log(this.listePlats);

    } catch (error) {
      console.error("Une erreur s'est produite :", error)
    }
  }








  


}

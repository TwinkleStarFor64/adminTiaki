import { Injectable, OnInit } from '@angular/core';
import { PlatI } from 'src/app/partage/modeles/Types';
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
  listePlats: any[] = [];

  constructor(public supa: SupabaseService) {this.supabase = createClient(environment.supabaseUrl,environment.supabaseKey)}

  async ngOnInit(): Promise<void> {
    this.fetchPlats();
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
          statut: item['statut']       
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
     return console.log("Pas de plats en BDD");      
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




  async fetchData() {
    try {     
      this.listePlats = await this.supa.getAttribuerPlats();
      console.log(this.listePlats);

    } catch (error) {
      console.error("Une erreur s'est produite :", error)
    }
  }





  /* async fetchAllUsersWithRoles() {
    try {
      const data: any = await this.supa.getAllUsersWithRoles();
      console.log("data de getAllUsersWithRoles", data);
  
      if (Array.isArray(data)) {
        // Logique pour traiter les données si elles sont un tableau
        this.allUsersData = data.map((item: any) => {
          console.log('Roles dans item :', item.roles); // Ajoutez le journal ici
  
          // Utilisez Object.keys pour obtenir les clés du tableau item.roles
          const rolesKeys = Object.keys(item.roles);
          // Utilisez les clés pour accéder aux valeurs et les placer dans un tableau
          const rolesArray = rolesKeys.map((key) => item.roles[key]);
  
          return {
            id: item.id,
            email: item.email,
            nom: item.nom,
            roles: rolesArray,
            selected: false,
          };
        });
  
        // Logique pour traiter les données
        console.log('Données récupérées avec succès dans fetchAllUsersWithRoles :', this.allUsersData);
  
        return;
      } else {
        // Logique pour traiter les données si elles ne sont pas un tableau
        throw new Error('Aucune donnée utilisateur et rôles disponibles');
      }
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des données rôles et utilisateurs',
        error
      );
      throw new Error(
        "Echec de la méthode fetchAllUsersWithRoles. Veuillez consulter les logs pour plus d'informations."
      );
    }
  } */


  


}

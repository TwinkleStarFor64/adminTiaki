import { Injectable } from '@angular/core';
import { PlatI } from 'src/app/partage/modeles/Types';
import { SupabaseService } from 'src/app/partage/services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class NutritionService {
  //plat: PlatI[] = [];
  listePlats: any[] = [];

  constructor(public supa: SupabaseService) { }

  async fetchPlats() {
    try {
      const data = await this.supa.getAttribuerPlats();
      console.log("Data de fetchPlats : ", data);
      
      if (Array.isArray(data)) {
        this.listePlats = data;

        // Utilisation de forEach pour itérer à travers chaque élément du tableau
        this.listePlats.forEach((element, index) => {
          // Accédez aux propriétés de chaque élément du tableau
          const platsObj = element.plats;
          const ciqualAnsesObj = element.ciqualAnses;         

          // Affichez les données de l'objet plats
          console.log(`Élément ${index + 1} - Plats :`);
          Object.keys(platsObj).forEach((key) => {
              console.log(`${key}: ${platsObj[key]}`);
          });

          // Affichez les données de l'objet ciqualAnses
          console.log(`Élément ${index + 1} - CiqualAnses :`);
          Object.keys(ciqualAnsesObj).forEach((key) => {
              console.log(`${key}: ${ciqualAnsesObj[key]}`);
          });         
      }); 

        console.log("Ici fetchPlats : ",this.listePlats);        
      }
    } catch (error) {
      console.log("Erreur de la méthode fetchPlats", error);      
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


  /* async fetchProfil() {
    try {
      // La méthode getProfil() récupére toutes les données utilisateurs et tout les rôles de l'utilisateur authentifié
      const data = await this.supa.getProfil();
      console.log("Data du profil", data); // Data est un tableau contenant plusieurs objets rôles et plusieurs objets utilisateur
      if (Array.isArray(data)) { // Vérifie si la variable data est un tableau en utilisant Array.isArray(data)
        this.profil = data[0]['utilisateur']; // Extrait le premier élément du tableau (data[0]) et récupère la propriété utilisateur
        this.profil.roles = []; // Un tableau vide est attribué à la propriété roles de l'objet profil. Cette étape est nécessaire pour s'assurer que le tableau des rôles est vide avant d'y ajouter des éléments.
        data.forEach((d) => {
          if (!this.profil.roles!.includes(d.roles.role)) // Vérifier si le rôle de l'élément actuel (d.roles.role) n'est pas déjà inclus dans le tableau des rôles
            this.profil.roles = this.profil.roles!.concat(d.roles.role);
        });
      } else { // Si data n'est pas un tableau
        this.profil = {
          id: data['id'],
          nom: data['nom'],
          prenom: data['prenom'],
          email: data['email'],
          roles: data['role'],
        };
      }
      console.log("Profil", this.profil);
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
    }
  } */


}

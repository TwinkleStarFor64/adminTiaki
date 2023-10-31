import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/partage/services/supabase.service';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.scss']
})
export class NutritionComponent implements OnInit{

userData: any [] = [];
id!: string;
authUserId: string | null;

constructor(public supa: SupabaseService) {
  this.authUserId = sessionStorage.getItem('authUserId');
}

ngOnInit(): void {
  //this.supa.getAllData();
  this.fetchAuthUserData();
  //this.fetchAllUsersData();
  console.log("authUserID : ",this.authUserId);
   
}


async fetchAuthUserData() {
  try {
    const groupData = await this.supa.getAllData();
    console.log("groupData : ", groupData);

    for (const objet of groupData) {
      const utilisateurId = objet.utilisateur.id; // Récupérez l'ID de l'utilisateur associé à cet objet
      const utilisateurNom = objet.utilisateur.nom;
      const utilisateurPrenom = objet.utilisateur.prenom;
      const role = objet.roles.role;

      // Vérifiez si l'ID de l'utilisateur correspond à authUserId
      if (utilisateurId === this.authUserId) {
        // Vérifiez si l'utilisateur existe déjà dans dataTest
        const existingUser = this.userData.find(user => user.utilisateurNom === utilisateurNom);

        if (existingUser) {
          existingUser.roles.push(role);
        } else {
          this.userData.push({
            utilisateurNom: utilisateurNom,
            utilisateurPrenom: utilisateurPrenom,
            roles: [role],
          });
        }
      }
    }

    console.log("Données à afficher en frontend : ", this.userData);
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
  }
}



async fetchAllUsersData() {
  try {
    const groupData = await this.supa.getAllData();
    console.log("groupData : ",groupData);
    
    for (const objet of groupData) {
      //console.log("Rôle de l'utilisateur : ", objet.roles);
      //console.log("Nom de l'utilisateur : ", objet.utilisateur.nom);
      //console.log("Id de l'utilisateur : ", objet.utilisateur.id);      
      
      const utilisateurNom = objet.utilisateur.nom;
      const utilisateurPrenom = objet.utilisateur.prenom;
      const role = objet.roles.role;

      // Vérifiez si l'utilisateur existe déjà dans dataTest
      const existingUser = this.userData.find(user => user.utilisateurNom === utilisateurNom);
      
      if (existingUser) {
        existingUser.roles.push(role);
      } else {
        this.userData.push({
          utilisateurNom: utilisateurNom,
            utilisateurPrenom: utilisateurPrenom,
          roles: [role],
        })
      }

    }    
    console.log("Données à afficher en frontend : ", this.userData);

  } catch (error) {
    console.error("Une erreur s'est produite :", error);
  }
}


}

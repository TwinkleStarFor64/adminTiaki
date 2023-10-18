import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RoleData, UtilisateurBisI, UtilisateurData, UtilisateurI } from 'src/app/partage/modeles/Types';
import { SupabaseService } from 'src/app/partage/services/supabase.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  utilisateur: UtilisateurBisI[] = [];
  allUsersData: UtilisateurData[] = [];

  profilForm!: FormGroup;
  

  constructor(public supa: SupabaseService) {}

  async ngOnInit(): Promise <void> {
    
    this.supa.getLoggedInUser();
    this.getUserProfil();
    this.fetchAllUsersWithRoles();
  }


  async getUserProfil() {
    const userData = await this.supa.getLoggedInUser();
    if (userData) {
      console.log(userData.id)
      const userId = await this.supa.getUtilisateurById(userData.id)
      const userIdData = userId.data;

      if (userIdData) {
        console.log(userIdData);
        this.utilisateur = userIdData.map((item: { [x: string]: any }) => ({
          id: item['id'],
          email: item['email'],
          nom: item['nom'],
          role: item['role'],
        }));
        console.log(this.utilisateur.map((item) => item['nom']).join(', '));        
      } 
                 
    }
    else {
      throw new Error("Aucune donnée utilisateur disponible.");      
    }
  }


  async fetchAllUsersWithRoles() {
    try {
      const usersWithRolesData: UtilisateurData[] = await this.supa.getAllUsersWithRoles();
      if (usersWithRolesData !== undefined) { // Vérification de nullité
        this.allUsersData = usersWithRolesData.map((item) => ({
          id: item.id,
          email: item.email,
          nom: item.nom,
          roles: item.roles
        }));

        // Afficher les utilisateurs avec leurs emails et rôles dans la console
        this.allUsersData.forEach((user) => {
          const allRoles = user.roles.map((role: RoleData) => role.role).join(', ');
          console.log(`Id: ${user.id}  Nom: ${user.nom}, Email: ${user.email}, Rôles: ${allRoles}`);
        });        

        this.getUserProfil();

      } else {
        throw new Error('Aucune donnée utilisateur et rôles disponibles');
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données rôles et utilisateurs", error);
      throw new Error("Echec de la méthode fetchAllUsersWithRoles. Veuillez consulter les logs pour plus d'informations.");
    }
  }

  


}


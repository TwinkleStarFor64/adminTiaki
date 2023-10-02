import { Component, OnInit } from '@angular/core';
import { UtilisateurI } from 'src/app/partage/modeles/Types';
import { SupabaseService } from 'src/app/partage/services/supabase.service';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss']
})
export class GestionComponent implements OnInit {
utilisateur: UtilisateurI[] = []; 
authUsers: UtilisateurI[] = []; 

  constructor(public supa:SupabaseService) {}

 async ngOnInit(): Promise <void> {
    this.fetchUtilisateur();   
    //this.supa.getUser();
    //this.supa.deleteUser(); 
    this.supa.listUser();
    this.fetchAuthUsers();  
    this.supa.getRoles();
    this.supa.fetchAttribuerRoles(); 
    this.supa.getAllUsersWithRoles();
  }

async fetchUtilisateur() {
  const { data, error } = await this.supa.getAdmin();
  if (data) {
    this.utilisateur = data.map((item: { [x: string]: any }) => ({
      id: item['id'],
      email: item['email'],
      nom: item['nom']
    }));
    console.log(this.utilisateur.map((item) => item['id']).join(', '));    
  }
  if (error) {
    console.log(error);    
  }
}



async fetchAuthUsers() {
  try {
    const userData = await this.supa.listUser();

    if (userData) {
      this.authUsers = userData.map((item: { [x: string]: any }) => ({
        id: item['id'],
        email: item['email'],
        nom: item['nom']
      }));
      console.log("Méthode fetchAuthUsers", this.authUsers.map((item) => item['email']).join(', '));
    } else {
      throw new Error("Aucune donnée utilisateur disponible.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    throw new Error("Echec de la méthode fetchAuthUsers. Veuillez consulter les logs pour plus d'informations.");
  }
}













}

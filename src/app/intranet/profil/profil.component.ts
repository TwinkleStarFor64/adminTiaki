import { Component, OnInit } from '@angular/core';
import { UtilisateurI } from 'src/app/partage/modeles/Types';
import { SupabaseService } from 'src/app/partage/services/supabase.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  utilisateur: UtilisateurI[] = [];

  constructor(public supa: SupabaseService) {}

  async ngOnInit(): Promise <void> {
    
    this.supa.getLoggedInUser();
    this.getUserProfil();
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
          nom: item['nom']
        }));
        console.log(this.utilisateur.map((item) => item['nom']).join(', '));       
      }           
    }
    else {
      throw new Error("Aucune donnée utilisateur disponible.");      
    }
  }

}


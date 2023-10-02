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
 

  constructor(public supa:SupabaseService) {}

 async ngOnInit(): Promise <void> {
    this.fetchUtilisateur();   
    //this.supa.getUser();
    //this.supa.deleteUser(); 
    this.supa.listUser();   
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













}

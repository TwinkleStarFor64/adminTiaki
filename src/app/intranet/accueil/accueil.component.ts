import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/partage/services/supabase.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {
  public cards:any = [
      {
        title:"Optométrie",
        text:" Ajoutez des exercices et créez les programmes pour les utilisateurs de l’interface optométrie.",
        button:"Accéder à l'espace Optométrie",
        image:"assets/images/accueil/accueil_opto.jpg",
        url:'opto'
      },
      {
        title:"Nutrition",
        text:" Réalisez des plats et des menus adaptés, utilisez ou ajoutez des ingrédients de façons détaillés.",
        button:"Accéder à l'espace Nutrition",
        image:"assets/images/accueil/accueil_nutrition.jpg",
        url:'nutrition'
      },
      {
        title:"Kinésithérapie",
        text:"Ajoutez des exercices et créez les programmes pour les utilisateurs de l’interface kinésithérapie",
        button:"Accéder à l'espace Kinésithérapie",
        image:"assets/images/accueil/famille-exercice.jpg",
        url:'kine'
      },
    ]
  constructor(private router:Router, public supa: SupabaseService) {}

  async ngOnInit(): Promise<void> {
    this.supa.getUtilisateur(); 
  }


}

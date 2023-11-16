import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { NutritionService } from './nutrition.service';
import { PlatI } from 'src/app/partage/modeles/Types';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.scss']
})
export class NutritionComponent implements OnInit{
  selectedPlats?: PlatI;
  filtre: string = ''; //Ce qui va servir à filtrer le tableau des ingrédients - utiliser dans ngModel
  
constructor(public supa: SupabaseService, public nutrition:NutritionService) { }

async ngOnInit(): Promise<void> {  
  //this.nutrition.fetchData();
  //this.supa.getAttribuerPlatsBis();
  this.nutrition.fetchPlats();
  
}

onSelectPlat(plat: PlatI) {  
    this.selectedPlats = plat;
    console.log("J'ai cliqué sur : " + this.selectedPlats.nom);
  
}








}

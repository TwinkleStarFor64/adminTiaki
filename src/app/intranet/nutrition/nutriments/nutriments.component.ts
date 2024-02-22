import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { NutrimentI } from 'src/app/partage/modeles/Types';
import { NutritionService } from '../nutrition.service';

@Component({
  selector: 'app-nutriments',
  templateUrl: './nutriments.component.html',
  styleUrls: ['./nutriments.component.scss','../nutrition.component.scss'],
  providers: [ConfirmationService, MessageService, DialogService], 
})
export class NutrimentsComponent {
 
  pageNutriments: number = 1; 
  selectedNutriments?: NutrimentI;    

  constructor(public nutrition: NutritionService) {}

  async ngOnInit(): Promise<void> {
   //this.nutrition.fetchNutriments();
    this.nutrition.getNutrimentsBis();
  }

  onSelectNutriments(nutriment: NutrimentI) {
    this.selectedNutriments = nutriment;
    console.log("Ici selectedNutriments : ", this.selectedNutriments.titre);    
  }


  // Méthode qui attribue des valeurs aux variables correspondant à l'objet sur lequel je clique - Utilisé sur le nom du menu en HTML
  /* onSelectNutriments(nutriment: NutrimentI, id: Array<number>) {
    this.initialSelectedNutrimentsState = { ...nutriment };
    console.log(this.initialSelectedNutrimentsState);
    this.selectedNutriments = nutriment;
    console.log("J'ai cliqué sur : " + this.selectedNutriments.titre);
    this.nutrition.fetchPlats();
  } */

  

}

import { Component, OnInit } from '@angular/core';
import { PaginationService } from 'ngx-pagination';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { NutritionService } from 'src/app/intranet/nutrition/nutrition.service';
import { PlatI } from 'src/app/partage/modeles/Types';

@Component({
  selector: 'app-ajout-plat',
  templateUrl: './ajout-plat.component.html',
  styleUrls: ['./ajout-plat.component.scss'],
  providers: [PaginationService], // Pour les modals PrimeNG 
})
export class AjoutPlatComponent implements OnInit {
  newPlat!: PlatI;
  filtreIngredients: string = ''; // Utiliser dans le ngModel affichant la liste des ingrédients - Filtre de recherche
  selectedPlats?: PlatI; // Utiliser dans onSelectPlat() - Pour savoir sur quel plat je clique et gérer le *ngIf

  constructor(public ref: DynamicDialogRef, public nutrition: NutritionService) {}

  ngOnInit(): void {
    this.newPlat = {
      id: 0,
      nom: '',
      description: '',
      alim_code: 0,
      idIngredients: [],
    }
  }

  onSubmitNewPlatForm() {
    console.log(this.newPlat);
    //console.log(this.newPlatForm.value);  
  }

  onCancelNewPlatForm() {
    this.ref.close();
  }

  // Ajouter un ingrédient sur un plat séléctionné
onSelectIngredient(id: number) {
  console.log("alim_code de l'ingrédient : ", id);
  // this.selectedPlats?.idIngredients est-il défini et non nul ?
  
  if (this.newPlat?.idIngredients) {
    this.newPlat.idIngredients.push(id);    
  }
}

}

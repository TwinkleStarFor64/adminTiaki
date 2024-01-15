import { Component, OnInit } from '@angular/core';
import { PaginationService } from 'ngx-pagination';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { NutritionService } from 'src/app/intranet/nutrition/nutrition.service';
import { PlatI } from 'src/app/partage/modeles/Types';

@Component({
  selector: 'app-ajout-plat',
  templateUrl: './ajout-plat.component.html',
  styleUrls: ['./ajout-plat.component.scss'],
  providers: [PaginationService, MessageService], // Pour le module de Pagination 
})
export class AjoutPlatComponent implements OnInit {
  newPlat!: PlatI;
  filtreIngredients: string = ''; // Utiliser dans le ngModel affichant la liste des ingrédients - Filtre de recherche
  selectedPlats?: PlatI; // Utiliser dans onSelectPlat() - Pour savoir sur quel plat je clique et gérer le *ngIf

  constructor(public ref: DynamicDialogRef, public nutrition: NutritionService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.newPlat = {
      id: 0,
      titre: '',
      description: '',
      //alim_code: null,
      ingredients: [],
      allergenes: [],
    }    
  }  
// Méthode pour le formulaire d'ajout d'un plat
  async onSubmitNewPlatForm() {
    try {
      console.log(this.newPlat); 
    // Je configure les valeurs de newPlat pour correspondre à newEntry sur createPlat()  
      await this.nutrition.createPlat({titre:this.newPlat.titre, description:this.newPlat.description, ingredients:this.newPlat.ingredients!});
      this.nutrition.fetchPlats();
      this.ref.close();
      
    } catch (error) {
      console.log("Erreur de la méthode onSubmitNewPlatForm : ", error);      
    }     
  }

// Fermer le formulaire d'ajout de plat
  onCancelNewPlatForm() {    
    this.ref.close();    
  }

// Ajouter un ingrédient 
  onSelectIngredient(id: number) {
    console.log("alim_code de l'ingrédient : ", id);  
  if (this.newPlat?.ingredients) {
    this.newPlat.ingredients.push(id);    
  }
}
// Supprimer un ingrédient
onDeleteIngredient(i: number) {
  if (this.newPlat?.ingredients) {
    this.newPlat.ingredients.splice(i, 1);    
  }
}
  
}

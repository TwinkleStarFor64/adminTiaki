import { Component, OnInit } from '@angular/core';
import { PaginationService } from 'ngx-pagination';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { NutritionService } from 'src/app/intranet/nutrition/nutrition.service';
import { AllergeneI, PlatI, PlatTypeI, StatutE } from 'src/app/partage/modeles/Types';
import { UtilsService } from 'src/app/partage/services/utils.service';

@Component({
  selector: 'app-ajout-plat',
  templateUrl: './ajout-plat.component.html',
  styleUrls: ['./ajout-plat.component.scss'],
  providers: [PaginationService, MessageService], // Pour le module de Pagination 
})
export class AjoutPlatComponent implements OnInit {
  newPlat!: PlatI;
  filtreIngredients: string = ''; // Utiliser dans le ngModel affichant la liste des ingrédients - Filtre de recherche
  //selectedPlats?: PlatI; // Utiliser dans onSelectPlat() - Pour savoir sur quel plat je clique et gérer le *ngIf
  selectedPlatsTypes!: PlatTypeI;
  selectedAllergenes!: AllergeneI;
  
  statut = Object.values(StatutE).map(value => value as StatutE); 

  constructor(public ref: DynamicDialogRef, public nutrition: NutritionService,public utils: UtilsService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.newPlat = {
      
      titre: '',
      description: '',      
      ingredients: [],
      statut: 0,
      nbPersonnes: 0,
    };   
    this.nutrition.getPlatsTypes(); 
    this.nutrition.getAllergenes();   
  }  
  
// Méthode pour le formulaire d'ajout d'un plat - data pour passer des données sur la modal ajoutPlat
  async onSubmitNewPlatForm(data: any) {
    try {
      console.log(this.newPlat); 
    // Je configure les valeurs de newPlat pour correspondre à newEntry sur createPlat()  
      await this.nutrition.createPlat({titre:this.newPlat.titre, description:this.newPlat.description, ingredients:this.newPlat.ingredients!, qualites:this.newPlat.qualites, astuces:this.newPlat.astuces, statut:this.newPlat.statut, nbPersonnes:this.newPlat.nbPersonnes}, this.selectedPlatsTypes.id, this.selectedAllergenes.id);
      //await this.nutrition.createPlatType(this.selectedPlatsTypes.id)
      this.nutrition.fetchPlats();
      this.ref.close(data);      
    } catch (error) {
      console.log("Erreur de la méthode onSubmitNewPlatForm : ", error);      
    }     
  }

// Fermer le formulaire d'ajout de plat - data pour passer des données sur la modal ajoutPlat
  onCancelNewPlatForm(data: any) {    
    this.ref.close(data);      
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

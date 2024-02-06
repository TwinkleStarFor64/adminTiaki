import { Component, OnInit } from '@angular/core';
import { PaginationService } from 'ngx-pagination';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { NutritionService } from 'src/app/intranet/nutrition/nutrition.service';
import { AllergeneI, LienI, NutriProgrammeI, NutrimentI, PlatI, PlatTypeI, RegimesI, StatutE } from 'src/app/partage/modeles/Types';
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
  selectedPlatsTypes!: PlatTypeI[];
  selectedAllergenes!: AllergeneI[];
  selectedRegimes!: RegimesI[];
  selectedProgrammes!: NutriProgrammeI[];
  selectedNutriments!: NutrimentI[];
  selectedLiens!: LienI[];

  statut = Object.values(StatutE).map(value => value as StatutE);
  
  constructor(public ref: DynamicDialogRef, public nutrition: NutritionService, public utils: UtilsService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.newPlat = {
      titre: '',
      description: '',
      ingredients: [],
      //statut: 0,
      nbpersonnes: 0,
    };    
  }

  // Méthode pour le formulaire d'ajout d'un plat - data pour passer des données sur la modal ajoutPlat (Dans plats.component.ts)
  async onSubmitNewPlatForm(data: any) {
    try {
      console.log(this.newPlat);      
      // Je configure les valeurs de newPlat pour correspondre à newEntry sur createPlat() 
        await this.nutrition.createPlat({
          titre: this.newPlat.titre,
          description: this.newPlat.description,
          ingredients: this.newPlat.ingredients!,
          qualites: this.newPlat.qualites,
          astuces: this.newPlat.astuces,
          nbPersonnes: this.newPlat.nbpersonnes,
          statut: this.newPlat.statut,
      // Ci-dessous je fais un map car j'envoie un tableau de nombre - Ajout de ? car je peux ne pas avoir de données
          allergenes: this.selectedAllergenes?.map(allergene => allergene.id),
          types: this.selectedPlatsTypes?.map(type => type.id),
          regimes: this.selectedRegimes?.map(regime => regime.id),
          programmes: this.selectedProgrammes?.map(programme => programme.id),
          nutriments: this.selectedNutriments?.map(nutriment => nutriment.id),
          liens: this.selectedLiens?.map(lien => lien.id)
        });      
      this.nutrition.fetchPlats(); // Pour mettre à jour la liste des plats après l'ajout d'un nouveau plat
      this.ref.close(data); // Pour la fermeture de la modal
    } catch (error) {
      console.log("Erreur de la méthode onSubmitNewPlatForm : ", error);
    }
  }

  // Fermer le formulaire d'ajout de plat - data pour passer des données sur la modal ajoutPlat (Dans plats.component.ts)
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



/* await this.nutrition.createPlat({
        titre: this.newPlat.titre,
        description: this.newPlat.description,
        ingredients: this.newPlat.ingredients!,
        qualites: this.newPlat.qualites,
        astuces: this.newPlat.astuces,
        statut: this.newPlat.statut,
        nbPersonnes: this.newPlat.nbPersonnes
      },
        this.selectedPlatsTypes.id,
        this.selectedAllergenes.id); */
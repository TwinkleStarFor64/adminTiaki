import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { NutritionService } from 'src/app/intranet/nutrition/nutrition.service';
import { MenuI } from 'src/app/partage/modeles/Types';

@Component({
  selector: 'app-ajout-menu',
  templateUrl: './ajout-menu.component.html',
  styleUrls: ['./ajout-menu.component.scss']
})
export class AjoutMenuComponent {
  newMenu!: MenuI;
  filtrePlats: string = ''; // Utiliser dans le ngModel affichant la liste des plats - Filtre de recherche
  selectedMenus?: MenuI; // Utiliser dans onSelectPlat() - Pour savoir sur quel menu je clique et gérer le *ngIf

  constructor(public ref: DynamicDialogRef, public nutrition: NutritionService) {}

  ngOnInit(): void {
    this.newMenu = {
      id: 0,
      titre: '',
      description: '',
      plats: [],
    }    
  }  
// Méthode pour le formulaire d'ajout d'un menu
  async onSubmitNewMenuForm() {
    try {
      console.log(this.newMenu); 
    // Je configure les valeurs de newMenu pour correspondre à newEntry sur createMenu()  
      await this.nutrition.createMenu({titre:this.newMenu.titre, description:this.newMenu.description, plats:this.newMenu.plats!});
      this.nutrition.fetchMenus();
    } catch (error) {
      console.log("Erreur de la méthode onSubmitNewPlatForm : ", error);      
    }    
     
  }
// Fermer le formulaire d'ajout de menu
  onCancelNewMenuForm() {
    this.ref.close();
  }

// Ajouter un Plat
  onSelectPlat(id: number) {
    console.log("id du plat", id);  
  if (this.newMenu?.plats) {
    this.newMenu?.plats.push(id);    
  }
}
// Supprimer un Plat
onDeletePlat(i: number) {
  if (this.newMenu?.plats) {
    this.newMenu?.plats.splice(i, 1);    
  }
}
}

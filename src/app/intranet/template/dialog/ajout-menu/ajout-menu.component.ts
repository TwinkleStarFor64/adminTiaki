import { Component } from '@angular/core';
import { PaginationService } from 'ngx-pagination';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { NutritionService } from 'src/app/intranet/nutrition/nutrition.service';
import { MenuI, PlatI } from 'src/app/partage/modeles/Types';
import { MenusPipe } from 'src/app/pipes/nutrition.pipe';



@Component({
  selector: 'app-ajout-menu',
  templateUrl: './ajout-menu.component.html',
  styleUrls: ['./ajout-menu.component.scss'],
  providers: [PaginationService,MenusPipe], 

})
export class AjoutMenuComponent {
  newMenu!: MenuI;
  filtrePlats: string = ''; // Utiliser dans le ngModel affichant la liste des plats - Filtre de recherche
  selectedMenus?: MenuI; // Utiliser dans onSelectPlat() - Pour savoir sur quel menu je clique et gérer le *ngIf
  plats: PlatI[] = [];
  platsTitres: string[] = []; 
  constructor(public ref: DynamicDialogRef, public nutrition: NutritionService,private nutri: NutritionService) {}

  async ngOnInit(): Promise<void> {
    this.newMenu = {
      id: 0,
      titre: '',
      description: '',
      plats: [],
     
    }  
    this.plats = await this.nutrition.getPlats();
      
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
// onSelectPlat(id: number) {
//   console.log("id du plat", id);  
//   const plat = this.nutri.getPlatById(id);
//   if (plat) {
//     if (this.newMenu && this.newMenu.plats) {
//       this.newMenu.plats.push(id);    
//       this.platsTitres.push(plat.titre);
//     }
//   } else {
//     console.log(`Aucun plat trouvé avec l'ID ${id}`);
//   }
// }
// Supprimer un Plat
onDeletePlat(i: number) {
  if (this.newMenu?.plats) {
    this.newMenu?.plats.splice(i, 1);    
  }
}
}

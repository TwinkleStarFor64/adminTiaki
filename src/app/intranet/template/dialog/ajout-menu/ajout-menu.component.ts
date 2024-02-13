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
  providers: [PaginationService, MenusPipe],
})
export class AjoutMenuComponent {
  newMenu!: MenuI;
  filtrePlats: string = ''; // Utiliser dans le ngModel affichant la liste des plats - Filtre de recherche
  selectedMenus?: MenuI; // Utiliser dans onSelectPlat() - Pour savoir sur quel menu je clique et gérer le *ngIf
  plats: PlatI[] = [];
  platsTitres: string[] = [];
  constructor(
    public ref: DynamicDialogRef,
    public nutrition: NutritionService,
    private nutri: NutritionService
  ) {}

  async ngOnInit(): Promise<void> {
    this.newMenu = {
      id: 0,
      titre: '',
      description: '',
      plats: [],
    };
    this.plats = await this.nutrition.getPlats();
  }
  // Méthode pour le formulaire d'ajout d'un menu
  async onSubmitNewMenuForm() {
    try {
      console.log(this.newMenu);
      const platIds = this.newMenu.plats?.map((plat) => plat.id) || [];
      // Passer les ID des plats à la méthode createMenu
      await this.nutrition.createMenu({
        titre: this.newMenu.titre,
        description: this.newMenu.description,
        plats: platIds as number[],
      });
      this.nutrition.fetchMenus();
    } catch (error) {
      console.log('Erreur de la méthode onSubmitNewPlatForm : ', error);
    }
  }
  // Fermer le formulaire d'ajout de menu
  onCancelNewMenuForm() {
    this.ref.close();
  }

  // Ajouter un Plat
  onSelectPlats(id: number) {
    console.log('id du plat : ', id);
    if (this.selectedMenus?.plats) {
      // Trouver le plat avec l'ID correspondant
      const plat = this.nutrition.plats.find((plat) => plat.id === id);
      if (plat) {
        // Ajouter l'objet plat complet à this.selectedMenus.plats
        this.selectedMenus.plats.push(plat);
      }
      this.nutrition.fetchPlats();
    }
  }
  // Supprimer un Plat
  onDeletePlat(i: number) {
    if (this.newMenu?.plats) {
      this.newMenu?.plats.splice(i, 1);
    }
  }
}

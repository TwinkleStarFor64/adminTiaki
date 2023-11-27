import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { NutritionService } from './nutrition.service';
import { CiqualI, PlatI } from 'src/app/partage/modeles/Types';
import { ConfirmationService, ConfirmEventType, MessageService,} from 'primeng/api';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.scss'],
  providers: [ConfirmationService, MessageService], // Pour les modals PrimeNG
})
export class NutritionComponent implements OnInit {
  selectedPlats?: PlatI; // Utiliser dans onSelectPlat() - Pour savoir sur quel plat je clique et gérer le *ngIf
  filtre: string = ''; // Ce qui va servir à filtrer le tableau des ingrédients - utiliser dans le ngModel affichant la liste des plats
  filtreIngredients: string = ''; // Utiliser dans le ngModel affichant la liste des ingrédients - Filtre de recherche
  platArray: PlatI[] = [];
  pagePlats: number = 1; // Utilisé dans le paginator HTML de la liste des plats pour définir la page de départ - paginate: { itemsPerPage: 1, currentPage: pagePlats }
  pageIngredients: number = 1; // Comme ci-dessus mais pour la liste d'ingrédients
  selectedIngredient?: CiqualI;

  constructor(
    public supa: SupabaseService,
    public nutrition: NutritionService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.nutrition.fetchPlats();
  // La méthode getAllCiqual() permet de voir la liste des ingrédients et d'attribuer des valeurs via la méthode onSelectPlat() qui à besoin des ingrédients
    this.nutrition.getAllCiqual();
  }

// Méthode utiliser dans l'input de recherche d'ingrédients afin de le réinitialiser
// Si l'input et vide ou pas vide la premiére page (pageIngredients) est défini à 1 afin de retrouver l'affichage initial
  onFilterChange() {
    if (this.filtre === '' || this.filtre != '') {
      this.pageIngredients = 1;
    }
  }

// Méthode qui attribue des valeurs aux variables correspondant à l'objet sur lequel je clique - Utilisé sur le nom du plat en HTML
  onSelectPlat(plat: PlatI, id: Array<number>) {
    // J'attribue à selectedPlats la value du plat ou j'ai cliqué - Utile pour le ngIf selectedPlats
    this.selectedPlats = plat;
    // J'attribue au paramétre id de la méthode le tableau d'alim_code contenu dans idIngredients
    this.selectedPlats.idIngredients = id;
    console.log("J'ai cliqué sur : " + this.selectedPlats.idIngredients);
    // Je passe en paramétre de la méthode fetchCiqual le tableau d'id obtenu au dessus
    this.nutrition.fetchCiqual(id);
  }

// Méthode pour la modal de suppression d'un plat OU d'un ingrédient
  DeleteDialog(id: number, del: boolean) {
    // Id correspond à plat.id au niveau du Html OU à i de let i=index pour un ingrédient
    this.confirmationService.confirm({
      // Le contenu de la boîte de dialogue
      message: 'Etes vous sûr de vouloir supprimer ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',      
      accept: () => {
        if (del) { // Si del est true (définie dans le html)
          this.deletePlat(id); // J'appele la méthode de suppression de plat et lui fournis id en paramétre
        } else {
          this.supprIngredient(id); // J'appele la méthode de suppression d'ingrédients et lui fournis id en paramétre (paramétre i sur supprIngredient())
        }
        // Pour la pop-up
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmation',
          detail: 'Suppression confirmée',
        });
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:            
            this.messageService.add({
              // Pour la pop-up
              severity: 'error',
              summary: 'Annuler',
              detail: 'Vous avez annuler',
            });
            console.log('Non a été cliqué, la modal sera simplement fermée.');
            break;
          case ConfirmEventType.CANCEL:            
            this.messageService.add({
              // Pour la pop-up
              severity: 'warn',
              summary: 'Annuler',
              detail: 'Vous avez annuler',
            });
            console.log('Annulation');
            break;
        }
      },
    });
  }  

// Méthode pour supprimer un plat sur la table plats
  async deletePlat(id: number) {
    // Id correspond à plat.id au niveau du HTML récupérer via la méthode de la modal au dessus
    await this.nutrition
      .deletePlatSupabase(id)
      .then(() => {
        this.nutrition.fetchPlats();
      })
      .catch((error) => {
        console.log(error);
      });
  }  

// Supprimer un ingrédient dans la liste sur un plat séléctionné
  supprIngredient(i:number){
    console.log("index de l'ingrédient : ", i);
    this.selectedPlats?.idIngredients?.splice(i, 1);
  // splice supprime l'ingrédient sur lequel j'ai cliqué en l'enlevant du tableau this.selectedPlats.idIngredients  
  }

// Ajouter un ingrédient sur un plat séléctionné
onSelectIngredient(id: number) {
  console.log("alim_code de l'ingrédient : ", id);
  // this.selectedPlats?.idIngredients est-il défini et non nul ?
  if (this.selectedPlats?.idIngredients) {
  // Ajoute l'ingredient sur lequel j'ai cliqué à la fin du tableau this.selectedPlats.idIngredients en utilisant son alim_code comme id
    this.selectedPlats.idIngredients.push(id);
  }  
}

async onSubmitForm() {
  try {
    await this.nutrition.updatePlat(
      this.selectedPlats!.id,
      this.selectedPlats!
    );
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
  }
}

}

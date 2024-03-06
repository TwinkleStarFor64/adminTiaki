import { Component } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { MenuE, MenuI, PlatI, StatutE} from 'src/app/partage/modeles/Types';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { NutritionService } from '../nutrition.service';
import { AjoutMenuComponent } from '../../template/dialog/ajout-menu/ajout-menu.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss', '../nutrition.component.scss'],
  providers: [ConfirmationService, MessageService, DialogService],
})
export class MenusComponent {
  pagePlats: number = 1; // Utilisé dans le paginator HTML de la liste des plats pour définir la page de départ - paginate: { itemsPerPage: 1, currentPage: pagePlats }
  pageMenus: number = 1; // Utilisé dans le paginator HTML de la liste des menus pour définir la page de départ - paginate: { itemsPerPage: 1, currentPage: pageMenus }
  filtre: string = ''; // Ce qui va servir à filtrer le tableau des menus - utiliser dans le ngModel affichant la liste des menus
  filtrePlats: string = ''; // Utiliser dans le ngModel affichant la liste des plats - Filtre de recherche  
  menu!: MenuI;
  selectedMenus?: MenuI; // Utiliser dans onSelectPlat() - Pour savoir sur quel plat je clique et gérer le *ngIf
  selectedPlats?: number;  
  
  statut = Object.values(StatutE).map(value => value as StatutE); // Utiliser comme [options] dans le p-dropdown du statut de publication d'un menu

  ref: DynamicDialogRef | undefined;

  constructor(
    public supa: SupabaseService,
    public nutrition: NutritionService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public dialogService: DialogService
  ) {}

  ajoutMenu() { // La méthode pour la modal d'ajout d'un nouveau plat
    this.ref = this.dialogService.open(AjoutMenuComponent, {
      header: 'Ajouter un Menu',
      width: '70%',
      height: '80vh',
      contentStyle: { overflow: 'hidden' }, // Pour cacher l'overflow globale de la modal
      baseZIndex: 10000,
      maximizable: true,
    });
  }

  async ngOnInit(): Promise<void> {
    await this.nutrition.fetchMenus();
    await this.nutrition.fetchPlats();      
  }

  onViewPlat(id: number) {
    //console.log("Cliqué sur le plat avec l'id : ", id);
    this.selectedPlats = id;
    //console.log(this.selectedPlats);    
  }

  // Méthode qui attribue des valeurs aux variables correspondant à l'objet sur lequel je clique - Utilisé sur le nom du menu en HTML
  onSelectMenu(menu: MenuI, id: Array<number>) {    
    this.selectedMenus = menu;
    console.log("Ici this.selectedMenus : ", this.selectedMenus);    
    //console.log("J'ai cliqué sur : " + this.selectedMenus.plats!.map((item) => item['titre']));    
  }

  // Méthode pour la modal de suppression d'un menu OU d'un plat
  DeleteDialog(id: number, del: boolean, plat: PlatI[] | undefined) {
    // Id correspond à menu.id au niveau du Html OU à i de let i=index pour un plat
    this.confirmationService.confirm({
      // Le contenu de la boîte de dialogue
      message: 'Etes vous sûr de vouloir supprimer ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (del) { // Si del est true (défini dans le html)
          this.deleteMenu(id); // J'appele la méthode de suppression de menu et lui fournis id en paramétre
        } else {
          this.supprPlat(id); // J'appele la méthode de suppression d'un plat et lui fournis id en paramétre (paramétre i sur supprIngredient())
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
              severity: 'error',
              summary: 'Annuler',
              detail: 'Vous avez annuler',
            });
            console.log('Non a été cliqué, la modal sera simplement fermée.');
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
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

  // Méthode pour confirmer ou annuler les modifications sur le formulaire d'un plat séléctionné
  ConfirmDialog(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Confirmer la modification ?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'oui', // Le label du bouton d'acceptation
      rejectLabel: 'non', // Le label du bouton d'annulation
      key: 'formulaire',
      accept: () => {
        this.onSubmitForm(); // Si confirmé j'appelle la méthode d'envoie du formulaire
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmation',
          detail: 'Modification confirmée',
        });
      },
      reject: () => {
        // Si annuler j'appelle la méthode d'annulation d'envoi du formulaire
        this.onCancelForm();
        this.messageService.add({
          severity: 'error',
          summary: 'Annuler',
          detail: 'Vous avez annuler',
        });
      },
    });
  }

  // Méthode pour supprimer un menu sur la table menus
  async deleteMenu(id: number) {
    // Id correspond à menu.id au niveau du HTML récupérer via la méthode de la modal DeleteDialog()
    await this.nutrition
      .deleteMenuSupabase(id)
      .then(() => {
        this.nutrition.fetchMenus();
      })
      .catch((error) => {
        console.log(error);
      });
  }

 
 async saveMenu() {
    try {
      await this.nutrition.updateMenu(
        this.selectedMenus!.id,
        this.selectedMenus!
      );
      this.nutrition.fetchPlats(); // Pour mettre à jour le formulaire ngModel      
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
    }
  }

  // Supprimer un ingrédient dans la liste sur un plat séléctionné - Paramétres récupérer dans DeleteDialog
  supprPlat(i: number) {
    console.log('index du plat : ', i);
    // splice supprime l'ingrédient sur lequel j'ai cliqué en l'enlevant du tableau this.selectedPlats.idIngredients
    this.selectedMenus?.plats?.splice(i, 1);
    this.nutrition.fetchPlats();
    console.log('Méthode supprPlats', this.selectedMenus?.plats);
  }

  // Ajouter un ingrédient sur un plat séléctionné
  onSelectPlats(id: number) {
    console.log("id du plat : ", id);
    // this.selectedMenus?.idIngredients est-il défini et non nul ?
    if (this.selectedMenus?.plats) {
      // Ajoute l'ingredient sur lequel j'ai cliqué à la fin du tableau this.selectedMenus.idIngredients en utilisant son alim_code comme id
     // this.selectedMenus.plats.push(id);
      // Appelle de fetchCiqual() pour mettre à jour les composants et leur quantité si je rajoute un ingrédient
      this.nutrition.fetchPlats();
    }
  }

  async onSubmitForm() {
      try {
        await this.nutrition.updateMenu(
          this.selectedMenus!.id,
          this.selectedMenus!
        );
        this.nutrition.fetchMenus(); // Pour mettre à jour le formulaire ngModel
      } catch (error) {
        console.error("Une erreur s'est produite :", error);
      }
    }
  
  onCancelForm() {
    // Je réattribue à selectedMenus les valeurs stockées dans onSelectPlat()
    this.selectedMenus = undefined; // Pour ne plus afficher la div contenant le formulaire du plat
    this.nutrition.fetchMenus();
  }
}
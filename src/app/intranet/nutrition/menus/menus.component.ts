import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ConfirmEventType,
  ConfirmationService,
  MessageService,
} from 'primeng/api';
import { MenuE, MenuI, PlatI } from 'src/app/partage/modeles/Types';
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
  pagePlats: number = 1; 
  pageMenus: number = 1; 
  pageIngredients: number = 1; 
  filtre: string = ''; 
  filtrePlats: string = ''; // Utiliser dans le ngModel affichant la liste des ingrédients - Filtre de recherche
  selectedPlat?: PlatI;
  selectedMenus?: MenuI; // Utiliser dans onSelectPlat() - Pour savoir sur quel plat je clique et gérer le *ngIf
  initialSelectedMenusState!: MenuI; // Pour stocker l'état initial de selectedPlats dans onSelectPlat
  //selectedIngredient?: CiqualI;
  //platArray: PlatI[] = [];
  ajoutMenuVisible: boolean = false; // Pour rendre visible le formulaire d'ajout d'un plat
  selectedMenusVisible: boolean = false; // Pour rendre visible le formulaire d'un plat existant et le modifier
  newMenu!: MenuI; // Pour le formulaire d'ajout d'un menu
  newMenuForm!: FormGroup;

  ref: DynamicDialogRef | undefined;

  constructor(
    public supa: SupabaseService,
    public nutrition: NutritionService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private formbuilder: FormBuilder,
    public dialogService: DialogService
  ) {}
  ajoutMenu() {
    // La méthode pour la modal d'ajout d'un nouveau plat
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
    this.nutrition.fetchMenus();
    this.nutrition.fetchPlats();

    this.newMenuForm = this.formbuilder.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      idPlats: this.formbuilder.array([]),
    });

    this.newMenu = {
      id: 0,
      titre: '',
      description: '',
      plats: [],
      statut: MenuE.valide,
      reaction: '',
    };
  }

  // Méthode qui attribue des valeurs aux variables correspondant à l'objet sur lequel je clique - Utilisé sur le nom du menu en HTML
  onSelectMenu(menu: MenuI, id: Array<PlatI>) {
    this.initialSelectedMenusState = { ...menu };
    console.log(this.initialSelectedMenusState);

    if (!this.selectedMenus) {
      this.selectedMenus = { ...menu };
    }
    this.selectedMenus.plats = id;
    console.log("J'ai cliqué sur : " + this.selectedMenus.titre);
    this.nutrition.fetchPlats();
  }

  // Méthode pour la modal de suppression d'un menu OU d'un plat
  DeleteDialog(id: number, del: boolean) {
    // Id correspond à menu.id au niveau du Html OU à i de let i=index pour un plat
    this.confirmationService.confirm({
      // Le contenu de la boîte de dialogue
      message: 'Etes vous sûr de vouloir supprimer ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (del) {
          // Si del est true (définie dans le html)
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
    // Id correspond à plat.id au niveau du HTML récupérer via la méthode de la modal DeleteDialog()
    await this.nutrition
      .deleteMenuSupabase(id)
      .then(() => {
        this.nutrition.fetchMenus();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  addPlatToMenu(plat: PlatI) {
    if (this.selectedPlat && this.selectedPlat) {
      this.selectedPlat.titre = plat.titre;
      // Enregistrez le menu mis à jour
      this.saveMenu();
    } else {
      console.error('selectedMenus or selectedMenus.plats is undefined');
    }
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

  // Ajouter un plat sur un menu séléctionné
  onSelectPlats(id: number) {
    console.log('id du plat : ', id);
    const plat = this.nutrition.plats.find((plat) => plat.id === id);
    if (plat) {
      this.selectedPlat = plat;
    }
    this.nutrition.fetchPlats();
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
    // Je réattribue à selectedPlats les valeurs stockées dans onSelectPlat()
    this.selectedMenus = undefined; // Pour ne plus afficher la div contenant le formulaire du plat
    this.nutrition.fetchMenus();
  }
}

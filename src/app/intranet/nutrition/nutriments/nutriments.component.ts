import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MesuresE, NutrimentI } from 'src/app/partage/modeles/Types';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { NutritionService } from '../nutrition.service';

@Component({
  selector: 'app-nutriments',
  templateUrl: './nutriments.component.html',
  styleUrls: ['./nutriments.component.scss','../nutrition.component.scss'],
  providers: [ConfirmationService, MessageService, DialogService],
  
 
})
export class NutrimentsComponent {
 
  pageNutriments: number = 1; 
  filtre: string = ''; 
  filtreNutriments: string = ''; 
  selectedNutriments?: NutrimentI; 
  initialSelectedNutrimentsState!: NutrimentI; 
  ajoutMenuVisible: boolean = false; 
  selectedMenusVisible: boolean = false; 
  newNutriment!: NutrimentI;
  newNutrimentForm!: FormGroup;
  ref: DynamicDialogRef | undefined;

  constructor(
    public supa: SupabaseService,
    public nutrition: NutritionService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private formbuilder: FormBuilder,
    public dialogService: DialogService
  ) { }


  async ngOnInit(): Promise<void> {
    this.nutrition.fetchNutriments();

    this.newNutrimentForm = this.formbuilder.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      idPlats: this.formbuilder.array([]),
    });

    this.newNutriment = {
      id: 0,
      titre: '',
      quantite: '',
      represente: '',
      //reaction: '',
      mesure: MesuresE.mcg,
    }
  }


  // Méthode qui attribue des valeurs aux variables correspondant à l'objet sur lequel je clique - Utilisé sur le nom du menu en HTML
  onSelectNutriments(nutriment: NutrimentI, id: Array<number>) {
    this.initialSelectedNutrimentsState = { ...nutriment };
    console.log(this.initialSelectedNutrimentsState);
    this.selectedNutriments = nutriment;
    console.log("J'ai cliqué sur : " + this.selectedNutriments.titre);
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
        if (del) { // Si del est true (définie dans le html)
          this.deleteNutriment(id);
        } else {
          this.supprPlat(id);
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
      key: "formulaire",
      accept: () => {
        this.onSubmitForm(); // Si confirmé j'appelle la méthode d'envoie du formulaire
        this.messageService.add({ severity: 'info', summary: 'Confirmation', detail: 'Modification confirmée' });
      },
      reject: () => { // Si annuler j'appelle la méthode d'annulation d'envoi du formulaire
        this.onCancelForm();
        this.messageService.add({ severity: 'error', summary: 'Annuler', detail: 'Vous avez annuler' });
      }
    });
  }

  supprPlat(i: number) {
    console.log("index du plat : ", i);
    // splice supprime l'ingrédient sur lequel j'ai cliqué en l'enlevant du tableau this.selectedPlats.idIngredients  
    this.selectedNutriments?.titre?.slice(i, 1);
    this.nutrition.fetchPlats();
    console.log("Méthode supprPlats");
  }


  // Méthode pour supprimer un nutriment
  async deleteNutriment(id: number) {
    // Id correspond à plat.id au niveau du HTML récupérer via la méthode de la modal DeleteDialog()
    await this.nutrition
      .deleteNutrimentSupabase(id)
      .then(() => {
        this.nutrition.fetchNutriments();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async onSubmitForm() {
    try {
      await this.nutrition.updateNutriments(
        this.selectedNutriments!.id,
        this.selectedNutriments!
      );
      this.nutrition.fetchMenus(); // Pour mettre à jour le formulaire ngModel      
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
    }
  }

  onCancelForm() {
    // Je réattribue à selectedPlats les valeurs stockées dans onSelectPlat()
    this.selectedNutriments = undefined; // Pour ne plus afficher la div contenant le formulaire du plat
    this.nutrition.fetchNutriments();

  }

}

import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlatI } from 'src/app/partage/modeles/Types';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { NutritionService } from '../nutrition.service';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AjoutPlatComponent } from '../../template/dialog/ajout-plat/ajout-plat.component';

@Component({
  selector: 'app-plats',
  templateUrl: './plats.component.html',
  styleUrls: ['./plats.component.scss','../nutrition.component.scss'],
  providers: [ConfirmationService, MessageService, DialogService], // Pour les modals PrimeNG  

})
export class PlatsComponent implements OnInit {
  pagePlats: number = 1; // Utilisé dans le paginator HTML de la liste des plats pour définir la page de départ - paginate: { itemsPerPage: 1, currentPage: pagePlats }
  pageIngredients: number = 1; // Comme ci-dessus mais pour la liste d'ingrédients
  filtre: string = ''; // Ce qui va servir à filtrer le tableau des ingrédients - utiliser dans le ngModel affichant la liste des plats
  filtreIngredients: string = ''; // Utiliser dans le ngModel affichant la liste des ingrédients - Filtre de recherche

  selectedPlats?: PlatI; // Utiliser dans onSelectPlat() - Pour savoir sur quel plat je clique et gérer le *ngIf
  initialSelectedPlatsState!: PlatI; // Pour stocker l'état initial de selectedPlats dans onSelectPlat
  //selectedIngredient?: CiqualI;
  //platArray: PlatI[] = [];
  ajoutPlatsVisible: boolean = false; // Pour rendre visible le formulaire d'ajout d'un plat
  selectedPlatsVisible: boolean = false; // Pour rendre visible le formulaire d'un plat existant et le modifier
  newPlat!: PlatI;
  newPlatForm!: FormGroup;

  ref: DynamicDialogRef | undefined;

  constructor(
    public supa: SupabaseService,
    public nutrition: NutritionService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private formbuilder: FormBuilder,
    public dialogService: DialogService    
  ) {}

  ajoutPlat() {
    this.ref = this.dialogService.open(AjoutPlatComponent, {
            header: 'Select a Product',
            width: '70%',
            height: '80vh',
            contentStyle: { overflow: 'hidden' },
            baseZIndex: 10000,
            maximizable: true
    })
  }  

  async ngOnInit(): Promise<void> {
    this.nutrition.fetchPlats();
  // La méthode getAllCiqual() permet de voir la liste des ingrédients et d'attribuer des valeurs via la méthode onSelectPlat() qui à besoin des ingrédients
    this.nutrition.getAllCiqual(); 
    this.newPlatForm = this.formbuilder.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      idIngredients: this.formbuilder.array([]),
    });

    this.newPlat = {
      id: 0,
      nom: '',
      description: '',
      alim_code: 0,
      idIngredients: [],
    }
  }

  toggleFormVisibility(formNumber: number) {
    //this.ajoutPlatsVisible = !this.ajoutPlatsVisible;
    if (formNumber === 1) {
      this.selectedPlatsVisible = true;
      this.ajoutPlatsVisible = false;
    } else if (formNumber === 2) {
      this.ajoutPlatsVisible = true;
      this.selectedPlatsVisible = false;
    }
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
    // Enregistrez l'état initial de selectedPlats lors de la sélection initiale
    if (!this.initialSelectedPlatsState) {
      this.initialSelectedPlatsState = { ...plat }; // J'utilise cette variable dans onCancelForm()
    }
    // J'attribue à selectedPlats la value du plat ou j'ai cliqué - Utile pour le ngIf selectedPlats
    this.selectedPlats = plat;
    // J'attribue au paramétre id de la méthode le tableau d'alim_code contenu dans idIngredients
    this.selectedPlats.idIngredients = id;
    console.log("J'ai cliqué sur : " + this.selectedPlats.idIngredients);
    // Je passe en paramétre de la méthode fetchCiqual le tableau d'id obtenu au dessus
    this.nutrition.fetchCiqual(id);
  }

// Méthode pour la modal de suppression d'un plat OU d'un ingrédient
  DeleteDialog(id: number, del: boolean, alimCode: Array<number> | undefined) {
    // Id correspond à plat.id au niveau du Html OU à i de let i=index pour un ingrédient
    this.confirmationService.confirm({
      // Le contenu de la boîte de dialogue
      message: 'Etes vous sûr de vouloir supprimer ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',      
      accept: () => {        
        if (del) { // Si del est true (définie dans le html)
          this.deletePlat(id); // J'appelle la méthode de suppression de plat et lui fournis id en paramétre
        } else {         
          this.supprIngredient(id, alimCode); // J'appelle la méthode de suppression d'ingrédients et lui fournis id en paramétre (paramétre i sur supprIngredient())
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
  supprIngredient(i:number, alimCode: Array<number> | undefined) {
    console.log("index de l'ingrédient : ", i);    
  // splice supprime l'ingrédient sur lequel j'ai cliqué en l'enlevant du tableau this.selectedPlats.idIngredients  
    this.selectedPlats?.idIngredients?.splice(i, 1);
    this.nutrition.fetchCiqual(alimCode);
    console.log(alimCode);
    
  }

// Ajouter un ingrédient sur un plat séléctionné
onSelectIngredient(id: number) {
  console.log("alim_code de l'ingrédient : ", id);
  // this.selectedPlats?.idIngredients est-il défini et non nul ?
  if (this.selectedPlats?.idIngredients) {
  // Ajoute l'ingredient sur lequel j'ai cliqué à la fin du tableau this.selectedPlats.idIngredients en utilisant son alim_code comme id
    this.selectedPlats.idIngredients.push(id);
  // Appelle de fetchCiqual() pour mettre à jour les composants et leur quantité si je rajoute un ingrédient
    this.nutrition.fetchCiqual(this.selectedPlats.idIngredients);
  }  
  if (this.newPlat?.idIngredients) {
    this.newPlat.idIngredients.push(id);    
  }
}

async onSubmitForm() {
  try {
    await this.nutrition.updatePlat(
      this.selectedPlats!.id,
      this.selectedPlats!
    );
    this.nutrition.fetchPlats(); // Pour mettre à jour le formulaire ngModel      
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
  }
}

onCancelForm() {  
  // Je réattribue à selectedPlats les valeurs stockées dans onSelectPlat()
  this.selectedPlats = { ...this.initialSelectedPlatsState };
}

onSubmitNewPlatForm() {
  console.log(this.newPlat);
  //console.log(this.newPlatForm.value);  
}

addIngredient() {
  const idIngredientsArray = this.newPlatForm.get('idIngredients') as FormArray;
  idIngredientsArray.push(this.formbuilder.control(''));
}
}

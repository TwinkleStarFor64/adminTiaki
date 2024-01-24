import { Component, OnInit } from '@angular/core';
import { AllergeneI, PlatI, PlatTypeI, StatutE } from 'src/app/partage/modeles/Types';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { NutritionService } from '../nutrition.service';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AjoutPlatComponent } from '../../template/dialog/ajout-plat/ajout-plat.component';
import { UtilsService } from 'src/app/partage/services/utils.service';

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
  plat!: PlatI;
  allergene: AllergeneI[] =[];
  selectedPlats?: PlatI; // Utiliser dans onSelectPlat() - Pour savoir sur quel plat je clique et gérer le *ngIf
  selectedType: PlatTypeI | undefined;
  //statut = Object.values(StatutE).map(value => value as StatutE); 
  ref: DynamicDialogRef | undefined; // Pour la modal d'ajout de plat - DynamicDialogModule
  
  constructor(
    public supa: SupabaseService,
    public nutrition: NutritionService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public dialogService: DialogService,
    public utils: UtilsService,    
  ) {}

  ajoutPlat() { // La méthode pour la modal d'ajout d'un nouveau plat
    this.ref = this.dialogService.open(AjoutPlatComponent, {
            header: 'Ajouter un plat',
            width: '70%',
            height: '80vh',
            contentStyle: { overflow: 'hidden' }, // Pour cacher l'overflow globale de la modal
            baseZIndex: 10000,
            maximizable: true
    });
    // Ci-dessous code pour gérer les différentes fermeture de la modal
    this.ref.onClose.subscribe((data: any) => { // data récupérer depuis ajout-plat.component.ts
        let summaryAndDetail;       
        if (data) {
          //console.log(data.buttonType);
          const buttonType = data?.buttonType;
          // Si un buttonType est défini premier message sinon le second
          summaryAndDetail = buttonType ? { summary :'Annulation', detail : 'Vous avez annuler', severity: 'error' } : { summary :'Validation', detail : 'Plat enregistré', severity: 'info' };
        } else {
          // Message pour la fermeture depuis l'icône de croix
          summaryAndDetail = { summary :'Fermeture', detail : 'Vous avez fermer', severity: 'warn' };
        }
        this.messageService.add({...summaryAndDetail});      
    });    
  };  

  async ngOnInit(): Promise<void> {
    this.nutrition.fetchPlats();
  // La méthode getCiqualJSON() permet de voir la liste des ingrédients et d'attribuer des valeurs via la méthode onSelectPlat() qui à besoin des ingrédients
    this.nutrition.getCiqualJSON();
    this.nutrition.testRpc();
  }

// Méthode qui attribue des valeurs aux variables correspondant à l'objet sur lequel je clique - Utilisé sur le nom du plat en HTML
  onSelectPlat(plat: PlatI, id: Array<number>) {
  // J'attribue à selectedPlats la value du plat ou j'ai cliqué - Utile pour le ngIf selectedPlats
    this.selectedPlats = plat;
    console.log("ici selectedPlats : ", this.selectedPlats);    
  // J'attribue au paramétre id de la méthode le tableau d'alim_code contenu dans idIngredients
    this.selectedPlats.ingredients = id;
    //console.log("J'ai cliqué sur les alim_code : " + this.selectedPlats.ingredients);
  // Je passe en paramétre de la méthode fetchCiqual le tableau d'id obtenu au dessus
    this.nutrition.fetchCiqual(id);    
    //console.log("Allergenes du plat : ", this.selectedPlats.allergenes);
    console.log("statut ", this.selectedPlats.statut);
    console.log("Youhou ", this.utils.convertStatut(this.selectedPlats.statut));
        
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
        if (del) { // Si del est true (définie dans le html) j'appelle la méthode ci-dessous 
          this.deletePlat(id); // J'appelle la méthode de suppression de plat et lui fournis id en paramétre
        } else { // Si del est pas true j'appelle la méthode ci-dessous  
  // J'appelle la méthode de suppression d'ingrédients et lui fournis id en paramétre (paramétre i sur supprIngredient() et alimCode correspondant à selectedPlats.idIngredients)        
          this.supprIngredient(id, alimCode); 
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
    // Id correspond à plat.id au niveau du HTML récupérer via la méthode de la modal DeleteDialog()
    await this.nutrition
      .deletePlatSupabase(id)
      .then(() => {
        this.nutrition.fetchPlats();
        this.selectedPlats = undefined; // Pour ne plus afficher la div contenant le formulaire du plat
      })
      .catch((error) => {
        console.log(error);
      });
  }  

// Supprimer un ingrédient dans la liste sur un plat séléctionné - Paramétres récupérer dans DeleteDialog
  supprIngredient(i:number, alimCode: Array<number> | undefined) {
    console.log("index de l'ingrédient : ", i);    
  // splice supprime l'ingrédient sur lequel j'ai cliqué en l'enlevant du tableau this.selectedPlats.idIngredients  
    this.selectedPlats?.ingredients?.splice(i, 1);
    this.nutrition.fetchCiqual(alimCode); // Pour mettre à jour le grammage des nutriments si j'en supprime
    console.log("Méthode supprIngredient", alimCode);    
  }

// Ajouter un ingrédient sur un plat séléctionné
onSelectIngredient(id: number) {
  console.log("alim_code de l'ingrédient : ", id);
  // this.selectedPlats?.idIngredients est-il défini et non nul ?
  if (this.selectedPlats?.ingredients) {
  // Ajoute l'ingredient sur lequel j'ai cliqué à la fin du tableau this.selectedPlats.idIngredients en utilisant son alim_code comme id
    this.selectedPlats.ingredients.push(id);
  // Appelle de fetchCiqual() pour mettre à jour les composants et leur quantité si je rajoute un ingrédient
    this.nutrition.fetchCiqual(this.selectedPlats.ingredients);
  }
}

// Formulaire pour modifier un plat existant
async onSubmitForm() {
  try {
    await this.nutrition.updatePlat(
      this.selectedPlats!.id!,
      this.selectedPlats!
    );
    this.nutrition.fetchPlats(); // Pour mettre à jour le formulaire ngModel      
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
  }
}

// Annuler le formulaire de modification d'un plat et retrouver les valeurs initiales
onCancelForm() {  
  this.selectedPlats = undefined; // Pour ne plus afficher la div contenant le formulaire du plat
  this.nutrition.fetchPlats();  
}






}

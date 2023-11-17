import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { NutritionService } from './nutrition.service';
import { PlatI } from 'src/app/partage/modeles/Types';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.scss'],
  providers: [ConfirmationService, MessageService], // Pour les modals PrimeNG
})


export class NutritionComponent implements OnInit{
  selectedPlats?: PlatI; // Utiliser dans onSelectPlat() - Pour savoir sur quel plat je clique et gérer le *ngIf
  filtre: string = ''; //Ce qui va servir à filtrer le tableau des ingrédients - utiliser dans ngModel  
  platArray: PlatI[] = [];  
  page: number = 1; // Utilisé dans le paginator HTML pour définir la page de départ - paginate: { itemsPerPage: 1, currentPage: page }
  
constructor(public supa: SupabaseService, public nutrition:NutritionService, private confirmationService: ConfirmationService, private messageService: MessageService,) { }

async ngOnInit(): Promise<void> {  
  //this.nutrition.fetchData();
  //this.supa.getAttribuerPlatsBis();
  this.nutrition.fetchPlats();
  
}

onSelectPlat(plat: PlatI) { // Utilisé sur le nom du plat en HTML 
    this.selectedPlats = plat; // J'attribue à selectedPlats la value du plat ou j'ai cliqué
    console.log("J'ai cliqué sur : " + this.selectedPlats.nom);  
}

// Méthode pour la modal de suppression d'un plat'
DeleteDialog(id: number) { // Id correspond à plat.id au niveau du HTML
  this.confirmationService.confirm({
    // Le contenu de la boîte de dialogue
    message: 'Etes vous sûr de vouloir supprimer ce plat ?',
    header: 'Supprimer le plat',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.deletePlat(id); // J'appele la méthode de suppression de plat et lui fournis id en paramétre 
      // Pour la pop-up
      this.messageService.add({ 
        severity: 'info',
        summary: 'Confirmation', 
        detail: 'Le plat est supprimer'
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
async deletePlat(id: number) { // Id correspond à plat.id au niveau du HTML récupérer via la méthode de la modal au dessus
  await this.nutrition.deletePlatSupabase(id)
    .then(() => {
      this.nutrition.fetchPlats();
    })
    .catch((error) => {
      console.log(error);    
    })
}








}

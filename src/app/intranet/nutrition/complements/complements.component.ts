import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PlatI } from 'src/app/partage/modeles/Types';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { NutritionService } from '../nutrition.service';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-complements',
  templateUrl: './complements.component.html',
  styleUrls: ['./complements.component.scss']
})
export class ComplementsComponent implements OnInit {
  pagePlats: number = 1; // Utilisé dans le paginator HTML de la liste des plats pour définir la page de départ - paginate: { itemsPerPage: 1, currentPage: pagePlats }
  pageIngredients: number = 1; // Comme ci-dessus mais pour la liste d'ingrédients
  filtre: string = ''; // Ce qui va servir à filtrer le tableau des ingrédients - utiliser dans le ngModel affichant la liste des plats
  filtreIngredients: string = ''; // Utiliser dans le ngModel affichant la liste des ingrédients - Filtre de recherche

  selectedPlats?: PlatI; // Utiliser dans onSelectPlat() - Pour savoir sur quel plat je clique et gérer le *ngIf
    
  ref: DynamicDialogRef | undefined; // Pour la modal d'ajout de plat - DynamicDialogModule

  constructor(
    public supa: SupabaseService,
    public nutrition: NutritionService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public dialogService: DialogService,
    
  ) {}

  ngOnInit(): void {
    this.nutrition.fetchComplements().subscribe(data => {
      console.log(data);
    });
    
  }


    
  
}

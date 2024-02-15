import { Component, OnInit } from '@angular/core';
import { NutritionService } from '../nutrition.service';
import { AllergeneI } from 'src/app/partage/modeles/Types';

@Component({
  selector: 'app-allergenes',
  templateUrl: './allergenes.component.html',
  styleUrls: ['./allergenes.component.scss']
})
export class AllergenesComponent implements OnInit{

  constructor(public nutrition: NutritionService) {}
  
  pageAllergene: number = 1;
  selectedAllergene?: AllergeneI;

  ngOnInit(): void {
    this.nutrition.getAllergenes();
  }

  onSelectAllergene(allergene: AllergeneI) {
    this.selectedAllergene = allergene;
    console.log("ici selectedAllergene : ", this.selectedAllergene.titre);
    
  }

}

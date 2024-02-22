import { Component, OnInit } from '@angular/core';
import { NutritionService } from '../nutrition.service';
import { CiqualI } from 'src/app/partage/modeles/Types';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss','../nutrition.component.scss']
})
export class IngredientsComponent implements OnInit {

constructor(public nutrition: NutritionService) {}

pageIngredients: number = 1;
selectedIngredient?: CiqualI;

ngOnInit(): void {
  this.nutrition.getCiqualJSON();

}

onSelectIngredient(ingredient: CiqualI) {
  this.selectedIngredient = ingredient;
  console.log("ici selectedIngredient : ", this.selectedIngredient['alim_code']);
  
}




}

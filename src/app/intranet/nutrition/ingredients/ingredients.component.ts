import { Component, OnInit } from '@angular/core';
import { NutritionService } from '../nutrition.service';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss']
})
export class IngredientsComponent implements OnInit {

constructor(public nutrition: NutritionService) {}

ngOnInit(): void {
  this.nutrition.getCiqualJSON();

}

}

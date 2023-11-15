import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { NutritionService } from './nutrition.service';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.scss']
})
export class NutritionComponent implements OnInit{
  
constructor(public supa: SupabaseService, public nutrition:NutritionService) {
  
}

ngOnInit(): void {  
  //this.nutrition.fetchPlats();
  this.nutrition.fetchData();
  this.supa.getAttribuerPlatsBis();
  
}









}

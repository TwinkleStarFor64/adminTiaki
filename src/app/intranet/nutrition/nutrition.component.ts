import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/partage/services/supabase.service';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.scss']
})
export class NutritionComponent implements OnInit{
  
constructor(public supa: SupabaseService) {
  
}

ngOnInit(): void {  
  this.supa.getAttribuerPlats();
  
  
}









}

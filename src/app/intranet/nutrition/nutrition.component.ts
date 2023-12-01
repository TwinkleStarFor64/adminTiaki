import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/partage/services/supabase.service';
import { NutritionService } from './nutrition.service';
import { PlatI } from 'src/app/partage/modeles/Types';
import { ConfirmationService, ConfirmEventType, MessageService,} from 'primeng/api';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.scss'],  
  providers: [ConfirmationService, MessageService], // Pour les modals PrimeNG  
})
export class NutritionComponent  {  
 

}

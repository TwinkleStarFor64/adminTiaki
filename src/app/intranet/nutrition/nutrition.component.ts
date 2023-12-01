import { Component } from '@angular/core';
import { ConfirmationService, MessageService,} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.scss'],  
  providers: [ConfirmationService, MessageService, DialogService], // Pour les modals PrimeNG  
})
export class NutritionComponent {  
  

}

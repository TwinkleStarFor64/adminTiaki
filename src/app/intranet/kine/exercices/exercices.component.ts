import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-exercices',
  templateUrl: './exercices.component.html',
  styleUrls: ['./exercices.component.scss', '../kine.component.scss'],
  providers: [ConfirmationService, MessageService, DialogService],
})
export class ExercicesComponent {
}

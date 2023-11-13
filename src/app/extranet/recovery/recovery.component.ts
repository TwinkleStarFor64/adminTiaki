import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/partage/services/supabase.service';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent implements OnInit {

  emailRegex!: RegExp; 
  email: string = '';
  popup = false;
  badEmail!: boolean; // Pas utilisé pour le moment ( optionel)

  constructor(public supa: SupabaseService) {}

  ngOnInit(): void {
    this.emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;    
  }

  async onSubmit() {
    console.log("l'input email: ", this.email);
    await this.supa.resetPassword(this.email);
    this.popup = true;

    //await this.supa.resetPasswordAndCheckEmail(this.email); // Si je veux vérifier que l'email existe en BDD
    this.badEmail = this.supa.badEmail; // Pour faire apparaître la balise HTML "L'email n'existe pas sur l'application Tiaki" - Pas utilisé pour le moment ( optionel)
  }



}

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

  constructor(public supa: SupabaseService) {}

  ngOnInit(): void {
    this.emailRegex = /^\S+@\S+\.\w+$/;
  }

  onSubmit() {
    console.log("l'input email: ", this.email);
    this.supa.resetPassword(this.email)
    this.popup = true;
  }



}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/partage/services/supabase.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnInit {
  passwordRegex!: RegExp;
  password: string = '';
  popup = false;

  constructor(private supa: SupabaseService, private router: Router) {}

  ngOnInit(): void {
    this.passwordRegex = /^[A-Za-z0-9]{6,}$/;
  }

  onSubmit() {
    console.log('New password : ', this.password);
    this.supa.updatePass(this.password);
    this.popup = true;
  }

  goAccueil() {
    this.router.navigate(['']); // Retour à la page principale de l'appli
  }
}

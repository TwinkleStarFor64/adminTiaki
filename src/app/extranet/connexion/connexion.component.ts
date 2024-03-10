import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from 'src/app/partage/services/supabase.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit { 
  
  badLogin!: boolean;
  loginForm!: FormGroup;

  constructor(private formbuilder: FormBuilder, public supa: SupabaseService) {}

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });    
  }

 async onSubmitForm() {
// J'utilise la méthode signIn de supabase.service.ts afin de comparer la value Email et Password du formulaire à l'email et MDP enregistré sur supabase
  await this.supa.signIn(this.loginForm.value.email, this.loginForm.value.password);   
  this.badLogin = this.supa.badLogin; // Pour faire apparaître la balise HTML "identifiants incorrects"       
  }

}













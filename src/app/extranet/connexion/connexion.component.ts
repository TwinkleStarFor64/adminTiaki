import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from 'src/app/partage/services/supabase.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {
 
  badLogin = false;

  loginForm!: FormGroup;

  constructor(private formbuilder: FormBuilder, public supa: SupabaseService) {}

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    
  }

  onSubmitForm() {
// J'utilise la méthode signIn de supabase.service.ts afin de comparer la value Email et Password du formulaire à l'email et MDP enregistré sur supabase
    this.supa.signIn(this.loginForm.value.email, this.loginForm.value.password);
    console.log(this.loginForm.value.password); // DANGER !!!! je vois le mdp ??!!
    
    this.badLogin = true; // Pour faire apparaître la balise HTML "identifiants incorrects"   
  }



}












/* onSubmitForm(): any {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    console.log('Email:', email);
    console.log('Password:', password);
    console.log(this.loginForm.value);

    if (email === 'alf@wanadoo.fr' && password === 'toto') {
      localStorage.setItem('token', 'myFakeToken');
      sessionStorage.setItem('token', 'myFaketoken');    
      this.router.navigate(['intranet']);
    } else {
      console.log('Identifiants incorrects !'); 
      this.badLogin = true;     
    }
  } */
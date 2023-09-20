import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent {

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  })

  badLogin = false;

  constructor(private router:Router) {}

  onSubmitForm(): any {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    console.log('Email:', email);
    console.log('Password:', password);
    console.log(this.loginForm.value);

    if (email === 'alf@wanadoo.fr' && password === 'toto') {
      localStorage.setItem('token', 'myFakeToken');
      this.router.navigate(['intranet']);
    } else {
      console.log('Identifiants incorrects !'); 
      this.badLogin = true;     
    }
  }



}

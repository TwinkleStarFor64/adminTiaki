import { Component, OnInit } from '@angular/core';
import { UsersService } from '../partage/services/users.service';

@Component({
  selector: 'app-intranet',
  templateUrl: './intranet.component.html',
  styleUrls: ['./intranet.component.scss']
})
export class IntranetComponent implements OnInit{

  userData: any [] = []; // Remplie dans le ngOnInit

  constructor(public users: UsersService) {}

  ngOnInit(): void {
    this.users.fetchProfil(); // J'appelle la méthode du service users.service.ts
    // this.userData = this.users.userData; // Je remplie la variable userData locale avec la variable userData de users.service.ts 
  }
}

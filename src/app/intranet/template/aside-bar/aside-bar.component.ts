import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsideI } from 'src/app/partage/modeles/Types';
import { DonneesService } from 'src/app/partage/services/donnees.service';

@Component({
  selector: 'app-aside-bar',
  templateUrl: './aside-bar.component.html',
  styleUrls: ['./aside-bar.component.scss'],
})
export class AsideBarComponent implements OnInit{
  value: number = 17;
  navbarVisible: boolean = false;  
  public hoveredIndex: number | null = null;

  constructor(private router: Router, public donnees: DonneesService) {}

  ngOnInit(): void {
    this.donnees.getAsideBar(); // La méthode de donnees.service qui fetch sur le JSON
  }

  toggleNavbar() {
    this.navbarVisible = !this.navbarVisible;
  }

  logout(index: number) {
    if (index === 1) {
      // Pour récupérer le 2e icône sur la Navbar
      // J'enléve le token de session - accès aux routes plus possible et retour à la page de connexion
      sessionStorage.removeItem('token');
      this.router.navigate(['']);
    }
  }
}

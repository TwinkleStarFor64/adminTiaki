import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AsideI } from 'src/app/partage/modeles/Types';

@Component({
  selector: 'app-aside-bar',
  templateUrl: './aside-bar.component.html',
  styleUrls: ['./aside-bar.component.scss'],
})
export class AsideBarComponent {
  value: number = 17;
  navbarVisible: boolean = false;

  // Insertion de l'interface Aside permettant de changer les image et les urls
  public asides: AsideI[] = [
    {
      nom: 'Mariam',
      image: 'assets/imageAsidebar/logoUser.svg',
      url: '/intranet/profil',
    },
    {
      nom: '',
      image: 'assets/imageAsidebar/deconnexion.svg',
      url: '/intranet/deconnexion',
    },
    {
      nom: 'Plats',
      image: 'assets/imageAsidebar/plat.svg',
      url: '/intranet/nutrition',
    },
    {
      nom: 'Menus',
      image: 'assets/imageAsidebar/menu.svg',
      url: '/intranet/nutrition/menus',
    },
    {
      nom: 'Ingrédients',
      image: 'assets/imageAsidebar/ingredients.svg',
      url: '/intranet/nutrition/ingredients',
    },
    {
      nom: 'Compléments',
      image: 'assets/imageAsidebar/complements.svg',
      url: '/intranet/nutrition/complements',
    },
    {
      nom: 'Allergènes',
      image: 'assets/imageAsidebar/allergenes.svg',
      url: '/intranet/nutrition/allergenes',
    },
    {
      nom: 'Exercices',
      image: 'assets/imageAsidebar/exerciceKine.svg',
      url: '/intranet/kine',
    },
    {
      nom: 'Programmes',
      image: 'assets/imageAsidebar/programmeKine.svg',
      url: '/intranet/kine/programme-kine',
    },
    {
      nom: 'Exercices',
      image: 'assets/imageAsidebar/exerciceOpto.svg',
      url: '/intranet/opto',
    },
    {
      nom: 'Programmes',
      image: 'assets/imageAsidebar/programmeOpto.svg',
      url: '/intranet/opto/programme-opto',
    },
    {
      nom: 'Utilisateurs',
      image: 'assets/imageAsidebar/gestionUtilisateur.svg',
      url: '/intranet/gestion',
    },
    {
      nom: 'Ajout',
      image: 'assets/imageAsidebar/ajoutUtilisateur.svg',
      url: '/intranet/gestion/ajout-utilisateurs',
    },
    {
      nom: 'Messageries',
      image: 'assets/imageAsidebar/gestionMail.svg',
      url: '/intranet/gestion/messagerie',
    },
    {
      nom: 'Communautés',
      image: 'assets/imageAsidebar/gestionCommunaute.svg',
      url: '/intranet/gestion/communaute',
    },
    {
      nom: 'Abonnements',
      image: 'assets/imageAsidebar/gestionAbonnement.svg',
      url: '/intranet/gestion/abonnement',
    },
    {
      nom: 'Médias',
      image: 'assets/imageAsidebar/gestionMedia.svg',
      url: '/intranet/gestion/medias',
    },
  ];
  public hoveredIndex: number | null = null;

  constructor(private router: Router) {}

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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetComponent } from './reset.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

describe('ResetComponent', () => {
  let component: ResetComponent;
  let fixture: ComponentFixture<ResetComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResetComponent],
      imports: [FormsModule,ButtonModule],
      providers: [Router],
    });
    fixture = TestBed.createComponent(ResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router); // Injection du router pour le test unitaire goAccueil()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test de la méthode goAccueil()
  it('should navigate to the home page when goAccueil is called', () => {
  // spyOn surveille la méthode 'navigate' du service Router
    const navigateSpy = spyOn(router, 'navigate');
  // Appel de la méthode à tester  
    component.goAccueil();
  // expect(navigateSpy).toHaveBeenCalledWith(['']) - Pour vérifier que la méthode navigate du service Router a été appelée avec l'argument [''].
  // Cela signifie que le test vérifie si goAccueil() a déclenché la navigation vers la page d'accueil de l'application, car [''] représente l'URL racine.  
    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });

});

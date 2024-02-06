import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionComponent } from './gestion.component';
import { RouterModule } from '@angular/router';
import { GestionUtilisateursPipe } from 'src/app/pipes/gestion-utilisateurs.pipe';



describe('GestionComponent', () => {
  let component: GestionComponent;
  let fixture: ComponentFixture<GestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionComponent,GestionUtilisateursPipe],
      imports:[RouterModule.forRoot([])],
      providers:[GestionUtilisateursPipe]
    });
    fixture = TestBed.createComponent(GestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

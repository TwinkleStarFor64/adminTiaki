import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AjoutPlatComponent } from './ajout-plat.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { NgxPaginationModule } from 'ngx-pagination';
import { IngredientsPipe, NutrimentsPipe } from 'src/app/pipes/nutrition.pipe';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { MesuresE } from 'src/app/partage/modeles/Types';

describe('AjoutPlatComponent', () => {
  let component: AjoutPlatComponent;
  let fixture: ComponentFixture<AjoutPlatComponent>;
  let dynamicDialogRefStub: Partial<DynamicDialogRef>;

  beforeEach(() => {
    dynamicDialogRefStub = {
      close: jasmine.createSpy('close')
    };

    TestBed.configureTestingModule({
      declarations: [AjoutPlatComponent,IngredientsPipe,NutrimentsPipe],
      imports: [ReactiveFormsModule,FormsModule,ButtonModule,NgxPaginationModule,HttpClientModule,ToastModule,InputNumberModule,MultiSelectModule,DropdownModule],
      providers: [{ provide: DynamicDialogRef, useValue: dynamicDialogRefStub }]
    });

    fixture = TestBed.createComponent(AjoutPlatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit new plat form', async () => {
// Arrange - Préparation des données de l'objet newPlat 
    component.newPlat = {
      titre: 'Test Unitaire Titre',
      description: 'Test Unitaire Description',
      ingredients: [1, 2],
      qualites: 'Test Unitaire Qualites',
      astuces: 'Test Unitaire Astuces',
      nbpersonnes: 2,
      statut: 0,
      allergenes: [{ id: 1, titre: 'Lait' }],
      types: [{ id: 2, type: 'Diner' }],
      regimes: [{ id: 3, titre: 'Végétarien' }],
      programmes: [{ id: 4, titre:'Vegan', statut: 1 }],
      nutriments : [{ id: 5, titre:'Zinc', quantite: '2', mesure: MesuresE.gr }],
      liens: [{ id: 6, titre:'Marmitton', url: 'fake url' }]
    };    

// Spy sur la méthode fetchPlats
    const fetchPlatsSpy = spyOn(component.nutrition, 'fetchPlats').and.callThrough();

// Action - Simulation de la soumission du formulaire
    await component.onSubmitNewPlatForm({});

// Assertion - Vérifier que la la méthode fetchPlats est appelée
    expect(fetchPlatsSpy).toHaveBeenCalled();

// Vérifier la fermeture de la modal DynamicDialog
    expect(dynamicDialogRefStub.close).toHaveBeenCalledWith({});
  });

});

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

describe('AjoutPlatComponent', () => {
  let component: AjoutPlatComponent;
  let fixture: ComponentFixture<AjoutPlatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjoutPlatComponent,IngredientsPipe,NutrimentsPipe],
      imports: [ReactiveFormsModule,FormsModule,ButtonModule,NgxPaginationModule,HttpClientModule,ToastModule,InputNumberModule,MultiSelectModule,DropdownModule],
      providers: [DynamicDialogRef]
    });
    fixture = TestBed.createComponent(AjoutPlatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { GestionUtilisateursPipe } from '../pipes/gestion-utilisateurs.pipe';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { AllergenesPipe, GetIngredientPipe, IngredientsPipe, MenusPipe, NutrimentsPipe, PlatsPipe } from '../pipes/nutrition.pipe';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';



@NgModule({
  declarations: [
    IngredientsPipe,
    MenusPipe,
    GetIngredientPipe,
    PlatsPipe,
    GestionUtilisateursPipe,
    NutrimentsPipe,
    AllergenesPipe
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ConfirmPopupModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    TableModule, 
    DynamicDialogModule,
    InputNumberModule,
    DropdownModule,
    MultiSelectModule,
    TabViewModule,
    AccordionModule
  ],
  exports: [
    PlatsPipe,
    MenusPipe,
    GestionUtilisateursPipe,
    GetIngredientPipe,
    IngredientsPipe,
    NgxPaginationModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmPopupModule,
    TableModule,
    ConfirmPopupModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    HttpClientModule,
    DynamicDialogModule,
    InputNumberModule,
    DropdownModule,
    MultiSelectModule,
    TabViewModule,
    AccordionModule,
    AllergenesPipe,
    NutrimentsPipe
  ],
  providers: [

  ] 
,
})
export class SharedModule { }
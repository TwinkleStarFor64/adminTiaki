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
import { GetIngredientPipe, IngredientsPipe, MenusPipe, NutrimentsPipe, PlatsPipe } from '../pipes/nutrition.pipe';

import { InputNumberModule } from 'primeng/inputnumber';


@NgModule({
  declarations: [
    IngredientsPipe,
    MenusPipe,
    GetIngredientPipe,
    PlatsPipe,
    GestionUtilisateursPipe,
    NutrimentsPipe
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
    InputNumberModule 
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
  ],
  providers: [

  ] 
,
})
export class SharedModule { }
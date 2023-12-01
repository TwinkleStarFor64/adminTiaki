import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientsPipe } from '../pipes/ingredients.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { GetIngredientPipe, MenusPipe } from '../pipes/menus.pipe';
import { PlatsPipe } from '../pipes/plats.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { GestionUtilisateursPipe } from '../pipes/gestion-utilisateurs.pipe';


@NgModule({
  declarations: [
    IngredientsPipe,
    MenusPipe,
    GetIngredientPipe,
    PlatsPipe,
    GestionUtilisateursPipe
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
  
  ]
})
export class SharedModule { }
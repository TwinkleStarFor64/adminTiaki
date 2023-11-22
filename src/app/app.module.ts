import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ConnexionComponent } from './extranet/connexion/connexion.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RecoveryComponent } from './extranet/recovery/recovery.component';
import { InputTextModule } from 'primeng/inputtext';
import { ResetComponent } from './extranet/reset/reset.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnexionComponent,
    RecoveryComponent,
    ResetComponent
  ],
  exports:[
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

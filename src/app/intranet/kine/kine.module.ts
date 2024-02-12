import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KineRoutingModule } from './kine-routing.module';
import { ExercicesComponent } from './exercices/exercices.component';
import { ProgrammesKineComponent } from './programmes-kine/programmes-kine.component';



@NgModule({
  declarations: [
    ExercicesComponent,
    ProgrammesKineComponent,
  ],
  imports: [
    CommonModule,
    KineRoutingModule
  ]
})
export class KineModule { }

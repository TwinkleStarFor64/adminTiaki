import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgrammeKineComponent } from './programme-kine/programme-kine.component';
import { KineRoutingModule } from './kine-routing.module';



@NgModule({
  declarations: [
    ProgrammeKineComponent,
  ],
  imports: [
    CommonModule,
    KineRoutingModule
  ]
})
export class KineModule { }

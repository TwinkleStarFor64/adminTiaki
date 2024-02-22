import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgrammeOptoComponent } from './programme-opto/programme-opto.component';
import { OptoRoutingModule } from './opto-routing.module';



@NgModule({
  declarations: [
    ProgrammeOptoComponent,
  ],
  imports: [
    CommonModule,
    OptoRoutingModule
  ]
})
export class OptoModule { }

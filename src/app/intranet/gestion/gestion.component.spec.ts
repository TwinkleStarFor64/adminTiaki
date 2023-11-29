import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionComponent } from './gestion.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DeleteDataComponent } from '../template/dialog/delete-data/delete-data.component';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


describe('GestionComponent', () => {
  let component: GestionComponent;
  let fixture: ComponentFixture<GestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionComponent,DeleteDataComponent],
      imports:[ButtonModule,ConfirmDialogModule,DialogModule, ReactiveFormsModule,FormsModule,RouterModule],
      providers:[ConfirmationService,MessageService]
    });
    fixture = TestBed.createComponent(GestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

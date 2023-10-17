import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionComponent } from './gestion.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DeleteDataComponent } from '../template/dialog/delete-data/delete-data.component';
import { DialogModule } from 'primeng/dialog';
import { EditUserComponent } from '../template/dialog/edit-user/edit-user.component';

describe('GestionComponent', () => {
  let component: GestionComponent;
  let fixture: ComponentFixture<GestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionComponent,DeleteDataComponent,EditUserComponent],
      imports:[ButtonModule,ConfirmDialogModule,DialogModule],
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

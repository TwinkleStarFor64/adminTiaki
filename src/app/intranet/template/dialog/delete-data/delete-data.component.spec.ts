import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDataComponent } from './delete-data.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

describe('DeleteDataComponent', () => {
  let component: DeleteDataComponent;
  let fixture: ComponentFixture<DeleteDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteDataComponent],
      imports:[ButtonModule,ConfirmDialogModule],
      providers:[ConfirmationService, MessageService]
    });
    fixture = TestBed.createComponent(DeleteDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { UtilisateursComponent } from 'src/app/intranet/gestion/utilisateurs/utilisateurs.component';

// Stub for app-delete-data
@Component({
  selector: 'app-delete-data',
  template: ''
})
class DeleteDataStubComponent {}

describe('UtilisateursComponent', () => {
  let component: UtilisateursComponent;
  let fixture: ComponentFixture<UtilisateursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        UtilisateursComponent,
        DeleteDataStubComponent // Declare the stub here
      ],
      // other imports...
    });
    fixture = TestBed.createComponent(UtilisateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnexionComponent } from './connexion.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('ConnexionComponent', () => {
  let component: ConnexionComponent;
  let fixture: ComponentFixture<ConnexionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConnexionComponent],
      imports: [ReactiveFormsModule]
    });
    fixture = TestBed.createComponent(ConnexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

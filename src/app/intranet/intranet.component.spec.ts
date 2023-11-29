import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IntranetComponent } from './intranet.component';
import { IntranetModule } from './intranet.module'; // Import du module Intranet contenant RouterModule pour l'utilisation de <router-outlet>
import { ActivatedRoute } from '@angular/router';
import { PlatsPipe } from '../pipes/plats.pipe';

describe('IntranetComponent', () => {
  let component: IntranetComponent;
  let fixture: ComponentFixture<IntranetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntranetComponent,PlatsPipe],
      imports: [IntranetModule],
      providers: [{ provide: ActivatedRoute, useValue: {} } // Simuler ActivatedRoute
    ],
    });
    fixture = TestBed.createComponent(IntranetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

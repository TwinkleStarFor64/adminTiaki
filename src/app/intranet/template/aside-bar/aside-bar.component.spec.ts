import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsideBarComponent } from './aside-bar.component';
import { GestionModule } from '../../gestion/gestion.module';
import { IntranetModule } from '../../intranet.module';
import { ActivatedRoute } from '@angular/router';


describe('AsideBarComponent', () => {
  let component: AsideBarComponent;
  let fixture: ComponentFixture<AsideBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsideBarComponent],
      imports: [ GestionModule, IntranetModule ],
      providers: [{ provide: ActivatedRoute, useValue: {} } // Simuler ActivatedRoute
    ],
    });
    fixture = TestBed.createComponent(AsideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

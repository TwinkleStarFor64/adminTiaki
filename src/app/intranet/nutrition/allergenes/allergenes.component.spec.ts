import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllergenesComponent } from './allergenes.component';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { AllergenesPipe } from 'src/app/pipes/nutrition.pipe';

describe('AllergenesComponent', () => {
  let component: AllergenesComponent;
  let fixture: ComponentFixture<AllergenesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllergenesComponent,AllergenesPipe],
      imports: [HttpClientModule,ButtonModule,PaginatorModule,NgxPaginationModule]
    });
    fixture = TestBed.createComponent(AllergenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

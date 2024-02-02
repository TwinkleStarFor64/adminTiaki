import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NutrimentsComponent } from './nutriments.component';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MenusPipe, NutrimentsPipe } from 'src/app/pipes/nutrition.pipe';
import { HttpClientModule } from '@angular/common/http';

describe('NutrimentsComponent', () => {
  let component: NutrimentsComponent;
  let fixture: ComponentFixture<NutrimentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NutrimentsComponent,NutrimentsPipe,MenusPipe],
      imports: [ButtonModule, PaginatorModule, NgxPaginationModule, ToastModule, ConfirmDialogModule, ConfirmPopupModule,HttpClientModule]
      
    });
    fixture = TestBed.createComponent(NutrimentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

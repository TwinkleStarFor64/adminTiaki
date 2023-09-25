import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/partage/services/supabase.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {

  constructor(private router:Router, public supa: SupabaseService) {}

  async ngOnInit(): Promise<void> {
    this.supa.getAdmin();  
  }


}

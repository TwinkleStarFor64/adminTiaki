import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from 'src/app/partage/services/supabase.service';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent implements OnInit {

  passwordForm!: FormGroup;
  passwordRegex!: RegExp;

  password: string = '';

  constructor(private formbuilder: FormBuilder, public supa: SupabaseService) {}

  ngOnInit(): void {
    this.passwordRegex = /^[A-Za-z0-9]{6,}$/;

    this.passwordForm = this.formbuilder.group({
      password: ['',[Validators.required, Validators.pattern(this.passwordRegex)]],      
    });

  }

  onSubmit() {
    console.log("l'input password : ", this.password);
    
  }



}

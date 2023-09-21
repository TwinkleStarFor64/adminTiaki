import { Injectable } from '@angular/core';
import {
  AuthSession,
  createClient,
  PostgrestSingleResponse,
  SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from 'src/environments/environement';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient; // Instance du client Supabase
  _session: AuthSession | null = null; // Session d'authentification

  constructor() { this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey) }


  /* getAuth(){
    const data = this.supabase.auth.signInWithPassword({email:'coucou', password:'leChat'}).then().catch();
    console.log("getAuth", data);    
  } */

  // Connexion à l'application - Tuto : https://www.youtube.com/watch?v=hPI8OegHPYc
  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({email, password});
  }


  async getAdmin() {
    const {data, error } = await this.supabase
      .from('admin')
      .select('*')
      if (data) {
        console.log(data);        
      }
      if (error) {
        console.log(error);        
      }
  }




}






/* 
getAuth(){
    this.supabase.auth.signInWithPassword({email:'coucou', password:'leChat'}).then().catch();
  }
*/
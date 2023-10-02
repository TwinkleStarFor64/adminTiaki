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
    const data = await this.supabase.from('admin').select('*');
    console.log(data);
    return data;    
  }

  
  async getUser() {
    const { data, error } = await this.supabase.auth.admin.getUserById('b3108489-62d7-45d4-8e02-0096dc12b78b');
    if (data) {
      console.log("getUser fonction ", data);
    }
    if (error) {
      console.log(error);      
    }    
  }
// '3845e166-dd29-47b4-924a-de0a1e50d454' Denver
// 'b3108489-62d7-45d4-8e02-0096dc12b78b' Toto

async deleteUser() {
  const { data, error } = await this.supabase.auth.admin.deleteUser('b3108489-62d7-45d4-8e02-0096dc12b78b');
  if (data) {
    console.log(data);    
  }
  if (error) {
    console.log(error);    
  }
}

async listUser() {
  const { data, error } = await this.supabase.auth.admin.listUsers();
  if (data) {
    console.log("listUser data : ", data.users);    
  }
  if (error) {
    console.log("listUser error : ", error);    
  }
}






  

}






import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Login } from '../interface/login';
import { firstValueFrom } from 'rxjs';
import { Register } from '../interface/register';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url = "http://localhost:5190/api/Auth";

  constructor(private http: HttpClient, private AuthService: AuthService) { }

  async login(form: any): Promise<Login>{
    try{
      const data = await firstValueFrom(
        this.http.post<Login>(`${this.url}/login`, form.value)
      );
      if (data && data.token){
        await this.AuthService.setToken(data.token);
        await this.AuthService.setUser(String(data.user.id));
      }
      return data;
    } catch (error: any){
      let errorMessage = this.handleError(error);
      return Promise.reject({error:{message: errorMessage}});
    }
  }

  async register(form: any): Promise<Register>{
    try{
      const data = await firstValueFrom(
        this.http.post<Register>(`${this.url}/register`, form.value)
      );
      if(data && data.token){
        await this.AuthService.setToken(data.token);
      }
      return data;
    }
    catch(error: any){
      let errorMessage = this.handleError(error);
      return Promise.reject({error: {message: errorMessage}});
    }
  }

  private handleError(error: any): string{
    let errorMessage = "Error desconocido";
    if(error instanceof HttpErrorResponse){
      if(error.error instanceof ErrorEvent){
        errorMessage = `Error: ${error.error.message}`;
      }
      else {
        errorMessage = `Error: ${error.status} - ${error.error.message}`;
      }
    }
    else{
      errorMessage = `Error: ${error.message}`;
    }
    console.error(errorMessage);
    return errorMessage;
  }
}

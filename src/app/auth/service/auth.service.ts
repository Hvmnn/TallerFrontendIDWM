import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey ="token";

  constructor(){}

  setToken(token: string): void{
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null{
    return localStorage.getItem(this.tokenKey);
  }
  
  removeToken(): void{
    localStorage.removeItem(this.tokenKey);
  }

  isAuth(): boolean{
    const token = this.getToken();
    return token !== null;
  }

  logOut(): void{
    this.removeToken();
  }
}

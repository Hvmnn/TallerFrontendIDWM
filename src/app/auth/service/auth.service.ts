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

  decodeToken(): any {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    const payload = token.split('.')[1];
    try {
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }

  getUserRole(): string {
    const decodedToken = this.decodeToken();
    if (!decodedToken) {
      return 'Usuario';
    }

    const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    return role || 'Usuario';
  }

  isAdmin(): boolean {
    const isAdmin = this.getUserRole() === 'Admin';
    console.log('isAdmin:', isAdmin);
    return isAdmin;
  }


}

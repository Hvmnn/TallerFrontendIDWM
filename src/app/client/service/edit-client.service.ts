import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { catchError, Observable, throwError } from 'rxjs';
import { observeNotification } from 'rxjs/internal/Notification';

@Injectable({
  providedIn: 'root'
})
export class EditClientService {

  private url = "http://localhost:5190/api/User";

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if(!this.authService.isAuth()){
      throw new Error('Usuario no autenticado');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  updateClient(form: any): Observable<any>{
    try{
      return this.http.put<any>(`${this.url}/${this.authService.getUser()}`,{
        Headers: this.getHeaders()
      }).pipe(
        catchError((error)=> this.handleErrorObservable(error)));
    }
    catch(error: any){
      return throwError(()=> new Error(this.handleError(error)));
    }
  }

  private handleErrorObservable(error: any): Observable<never> {
    let errorMessage = this.handleError(error);
    return throwError(() => new Error(errorMessage));
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

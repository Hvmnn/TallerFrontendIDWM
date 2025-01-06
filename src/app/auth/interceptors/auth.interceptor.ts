import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../service/auth.service';

export const authInterceptor:HttpInterceptorFn = (

  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> =>{

  const token = localStorage.getItem('token');
  console.log('Token en interceptor:',token);

  let modifiedRequest = req;
  if(token){
    modifiedRequest = req.clone({
      headers: req.headers.set('Authorization',`Bearer ${token}`),
    });
  }
  
  return next(modifiedRequest).pipe(
    tap((event) => {
      console.log('Event:', event);

      if(event instanceof HttpResponse){
        const newToken = event.body.data.token;
        console.log('Nuevo token:', newToken);
      }
    })
  );
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl: string = 'http://localhost:5190/api/Product';

  private http = inject(HttpClient);

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createProduct(product: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, product, {
      headers: this.getHeaders(),
    });
  }

  updateProduct(id: number, product: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product, {
      headers: this.getHeaders(),
    });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  uploadImage(formData: FormData): Observable<any> {
    const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dx71lh0ez/image/upload';
    return this.http.post<any>(cloudinaryUrl, formData);
  }
}

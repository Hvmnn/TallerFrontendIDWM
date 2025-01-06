import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';

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

  // Obtener todos los productos
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  // Obtener un producto por ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // Crear un producto (usando FormData para manejar imágenes)
  createProduct(product: FormData): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product, {
      headers: this.getHeaders(),
    });
  }

  // Actualizar un producto
  updateProduct(id: number, product: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product, {
      headers: this.getHeaders(),
    });
  }

  // Eliminar un producto
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // Subir una imagen a Cloudinary
  uploadImage(formData: FormData): Observable<{ secure_url: string }> {
    const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dx71lh0ez/image/upload';
    return this.http.post<{ secure_url: string }>(cloudinaryUrl, formData);
  }
}

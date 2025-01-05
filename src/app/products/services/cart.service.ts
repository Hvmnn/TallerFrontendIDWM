import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl: string = 'http://localhost:5190/api/Shopping';

  private http = inject(HttpClient);

  private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('token');
      return new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
    }

  getCart(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  addItemToCart(
    userId: number,
    product: { id: number; name: string; price: number },
    quantity: number
  ): Observable<any> {
    const payload = {
      ProductId: product.id,
      ProductName: product.name,
      ProductPrice: product.price,
      Quantity: quantity,
    };

    return this.http.post(`${this.apiUrl}/${userId}/add`, payload, {
      headers: this.getHeaders(),
    });
  }


  updateItemQuantity(userId: number, productId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/update/${productId}`, quantity);
  }

  deleteItemFromCart(userId: number, productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/delete/${productId}`);
  }

  clearCart(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/clear`);
  }
}

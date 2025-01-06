import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [HttpClientModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  userId: number | null = null;
  cartItems: any[] = []; // Array para los elementos del carrito
  totalPrice = 0;
  isLoading = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.extractUserIdFromToken();
    if (this.userId !== null) {
      this.loadCart();
    } else {
      console.error('No se pudo obtener el ID del usuario.');
    }
  }

  private extractUserIdFromToken(): void {
    const token = localStorage.getItem('token'); // Usa cookies si el token está ahí
    if (!token) {
      console.error('No se encontró un token.');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el token JWT
      this.userId = payload?.Id || null;
      if (!this.userId) {
        console.error('El token no contiene el userId.');
      }
    } catch (error) {
      console.error('Error al procesar el token JWT:', error);
      this.userId = null;
    }
  }

  loadCart(): void {
    if (this.userId === null) {
      console.error('El ID del usuario no está definido.');
      return;
    }

    this.isLoading = true;
    this.cartService.getCart(this.userId).subscribe({
      next: (cart) => {
        this.cartItems = cart?.cartItems || []; // Ajuste para usar `cartItems` del DTO
        this.calculateTotalPrice();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar el carrito:', err);
        this.cartItems = []; // Resetea cartItems en caso de error
        this.isLoading = false;
      },
    });
  }

  increaseQuantity(productId: number): void {
    const item = this.cartItems.find((i) => i.productId === productId);
    if (item && this.userId !== null) {
      this.cartService.updateItemQuantity(this.userId, productId, item.quantity + 1).subscribe({
        next: () => this.loadCart(),
        error: (err) => console.error('Error al actualizar cantidad:', err),
      });
    }
  }

  decreaseQuantity(productId: number): void {
    const item = this.cartItems.find((i) => i.productId === productId);
    if (item && this.userId !== null) {
      if (item.quantity > 1) {
        this.cartService.updateItemQuantity(this.userId, productId, item.quantity - 1).subscribe({
          next: () => this.loadCart(),
          error: (err) => console.error('Error al actualizar cantidad:', err),
        });
      } else {
        this.removeFromCart(productId);
      }
    }
  }

  removeFromCart(productId: number): void {
    if (this.userId !== null) {
      this.cartService.deleteItemFromCart(this.userId, productId).subscribe({
        next: () => this.loadCart(),
        error: (err) => console.error('Error al eliminar producto:', err),
      });
    }
  }

  calculateTotalPrice(): void {
    if (Array.isArray(this.cartItems) && this.cartItems.length > 0) {
      this.totalPrice = this.cartItems.reduce((acc, item) => acc + item.productPrice * item.quantity, 0);
    } else {
      this.totalPrice = 0; // Reinicia el total si no hay elementos
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/service/auth.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: any[] = [];

  constructor(private productsService: ProductsService, private authService: AuthService, private cartService: CartService,  private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void{
    this.productsService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        console.log('Productos cargados:', products);
      },
      error: (error) => {
        console.error('Error al cargar los productos:', error);
      },
    });
  }

  editProduct(productId: number): void {
    this.router.navigate(['/products/', productId]);
  }

  createProduct(): void {
    this.router.navigate(['/products/new']);
  }


  deleteProduct(productId: number): void {
    if (confirm('¿Estás seguro de eliminar el producto?')) {
      this.productsService.deleteProduct(productId).subscribe({
        next: () => {
          console.log('Producto eliminado:');
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error al eliminar el producto:', error);
        },
      });
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  addToCart(product: any): void {
    const token = localStorage.getItem('token'); // O usa cookies si está ahí
    if (!token) {
      alert('Debe iniciar sesión para agregar productos al carrito.');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el token JWT
      const userId = payload?.Id;

      if (!userId) {
        console.error('El token no contiene el userId.');
        alert('No se pudo identificar al usuario.');
        return;
      }

      // Valida que los datos del producto sean válidos
      if (!product.id || !product.name || !product.price) {
        console.error('Datos del producto inválidos:', product);
        alert('Producto inválido.');
        return;
      }

      this.cartService.addItemToCart(userId, product, 1).subscribe({
        next: () => alert('Producto agregado al carrito'),
        error: (err) => {
          console.error('Error al agregar producto:', err);
          alert('No se pudo agregar el producto al carrito.');
        },
      });
    } catch (error) {
      console.error('Error al procesar el token JWT:', error);
      alert('Token inválido o mal formado.');
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { AuthService } from '../../../auth/service/auth.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-product-list',
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  allowedTypes: string[] = ['Poleras', 'Gorros', 'Jugueteria', 'Alimentacion', 'Libros'];
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 8;
  pages: number[] = [];
  selectedType: string | null = null;
  orderBy: 'asc' | 'desc' | null = null;

  constructor(
    private productsService: ProductsService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products.map((product) => ({
          ...product,
          imageUrl: product.image,
        }));
        this.filteredProducts = this.products;
        this.calculatePagination();
      },
      error: (error) => {
        console.error('Error al cargar los productos:', error);
      },
    });
  }

  calculatePagination(): void {
    const totalItems = this.filteredProducts.length;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    this.changePage(1);
  }

  changePage(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredProducts = this.applyFilters().slice(startIndex, endIndex);
  }

  filterProducts(): void {
    this.filteredProducts = this.applyFilters();
    this.calculatePagination();
  }

  filterByType(type: string): void {
    this.selectedType = this.selectedType === type ? null : type;
    this.filteredProducts = this.applyFilters();
    this.calculatePagination();
  }

  sortProducts(order: 'asc' | 'desc'): void {
    this.orderBy = order;
    this.filteredProducts = this.applyFilters();
    this.calculatePagination();
  }

  applyFilters(): Product[] {
    let filtered = this.products.filter((product) => {
      const matchesSearch =
        !this.searchQuery ||
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesType = !this.selectedType || product.type === this.selectedType;
      return matchesSearch && matchesType;
    });

    if (this.orderBy === 'asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.orderBy === 'desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
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

  addToCart(product: Product): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debe iniciar sesión para agregar productos al carrito.');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload?.Id;

      if (!userId) {
        console.error('El token no contiene el userId.');
        alert('No se pudo identificar al usuario.');
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

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}

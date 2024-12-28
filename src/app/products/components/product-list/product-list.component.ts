import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: any[] = [];

  constructor(private productsService: ProductsService) {}

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
    console.log('Editar producto:', productId);
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
}

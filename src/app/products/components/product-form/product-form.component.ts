import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit{

    productForm: FormGroup;
    productId: number | null = null;
    allowedTypes = ['Poleras', 'Gorros', 'Jugueteria', 'Alimentacion', 'Libros'];

    constructor(
      private fb: FormBuilder,
      private productsService: ProductsService,
      private route: ActivatedRoute,
      private router: Router
    ) {
      this.productForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(64)]],
        type: ['', [Validators.required, Validators.pattern(this.allowedTypes.join('|'))]],
        price: ['', [Validators.required, Validators.min(0), Validators.max(100000000)]],
        stock: ['', [Validators.required, Validators.min(0), Validators.max(100000)]],
        image: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productId = id !== null ? Number(id) : null;
    if (this.productId) {
      this.productsService.getProductById(this.productId).subscribe({
        next: (product) => this.productForm.patchValue(product),
        error: (error) => console.error('Error al obtener el producto:', error),
      });
    }
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      return;
    }

    const productData = this.productForm.value;

    if (this.productId) {
      this.productsService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          console.log('Producto actualizado:');
          this.router.navigate(['/products']);
        },
        error: (error) => console.error('Error al actualizar el producto:', error),
      });
    }
    else {
      this.productsService.createProduct(productData).subscribe({
        next: () => {
          console.log('Producto creado:');
          this.router.navigate(['/products']);
        },
        error: (error) => console.error('Error al crear el producto:', error),
      });
    }
  }

  validateFile(event: any): void {
    const file = event.target.files[0];
    const allowedExtensions = ['.png', '.jpg'];
    const maxSize = 10 * 1024 * 1024;

    if (file) {
      const fileExtension = file.name.split('.').pop();
      const isValidExtension = allowedExtensions.includes(`.${fileExtension}`);
      const isValidSize = file.size <= maxSize;

      if (isValidExtension && isValidSize) {
        this.productForm.patchValue({ image: file});
      }
      else{
        this.productForm.get('image')?.setErrors({ invalidFile: true });
      }
    }
  }
}

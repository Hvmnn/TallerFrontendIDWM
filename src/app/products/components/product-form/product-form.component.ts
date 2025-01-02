import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  productId: number | null = null;
  allowedTypes = ['Poleras', 'Gorros', 'Jugueteria', 'Alimentacion', 'Libros'];
  isLoading = false;
  imageError: string | null = null;
  errorMessage: string | null = null;

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
      image: [null, [Validators.required]],
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

    this.isLoading = true;
    const formData = new FormData();
    const productData = this.productForm.value;

    Object.keys(productData).forEach((key) => {
      if (key === 'image' && productData[key]) {
        formData.append(key, productData[key]);
      } else {
        formData.append(key, productData[key]);
      }
    });

    const observable = this.productId
      ? this.productsService.updateProduct(this.productId, formData)
      : this.productsService.createProduct(formData);

    observable.subscribe({
      next: () => {
        console.log('Producto guardado');
        this.isLoading = false;
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Error al guardar el producto:', error);
        this.errorMessage = 'No se pudo guardar el producto. Verifica los datos e inténtalo nuevamente.';
        this.isLoading = false;
      },
    });
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
        this.imageError = null;
        this.productForm.patchValue({ image: file });
      } else {
        this.imageError = 'El archivo debe ser .png o .jpg y no superar los 10 MB.';
        this.productForm.get('image')?.setErrors({ invalidFile: true });
      }
    }
  }
}

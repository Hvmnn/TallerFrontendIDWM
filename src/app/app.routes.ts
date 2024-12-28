import { Routes } from '@angular/router';
import { ProductListComponent } from './products/components/product-list/product-list.component';
import { ProductFormComponent } from './products/components/product-form/product-form.component';
import { ProductDetailComponent } from './products/components/product-detail/product-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'products/new', component: ProductFormComponent },
  { path: 'products/:id', component: ProductDetailComponent }
];

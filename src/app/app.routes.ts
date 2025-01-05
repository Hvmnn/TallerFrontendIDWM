import { Routes } from '@angular/router';
import { ProductListComponent } from './products/components/product-list/product-list.component';
import { ProductFormComponent } from './products/components/product-form/product-form.component';
import { LoginComponent } from './auth/page/login/login.component';
import { authGuard } from './auth/guards/auth.guard';
import { RegisterComponent } from './auth/page/register/register.component';
import { CartComponent } from './products/components/cart/cart.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'products/new', component: ProductFormComponent, canActivate: [authGuard] },
  { path: 'products/:id', component: ProductFormComponent, canActivate: [authGuard] },
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: '/not-found' }
];

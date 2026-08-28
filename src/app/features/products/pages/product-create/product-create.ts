import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './product-create.html',
  styleUrl: './product-create.scss',
})
export class ProductCreate {
  form!: FormGroup;
  isSubmitting = signal(false);

  private formBuilder = inject(FormBuilder);
  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  constructor() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
      sku: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      description: ['', Validators.maxLength(500)],
      brand: ['', Validators.maxLength(120)],
      category: ['', Validators.maxLength(120)],
      active: [true]
    });
  }

  get name() {
    return this.form.get('name');
  }

  get sku() {
    return this.form.get('sku');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.snackBar.open('Please fill all required fields correctly.', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmitting.set(true);

    this.productService.createProduct(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Product created successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        console.error('Error creating product:', error);
        this.snackBar.open('Failed to create product. Please try again.', 'Close', { duration: 5000 });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}

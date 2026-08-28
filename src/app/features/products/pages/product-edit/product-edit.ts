import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';
import { ProductResponseDto } from '../../interfaces/product-response';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.scss',
})
export class ProductEdit implements OnInit {
  form!: FormGroup;
  isSubmitting = signal(false);
  product = signal<ProductResponseDto | null>(null);
  productId: number | null = null;

  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      if (this.productId) {
        this.loadProduct(this.productId);
      }
    });
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

  private loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.form.patchValue({
          name: product.name,
          sku: product.sku,
          description: product.description,
          brand: product.brand,
          category: product.category,
          active: product.active
        });
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.snackBar.open('Failed to load product. Please try again.', 'Close', { duration: 5000 });
        this.router.navigate(['/products']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid && this.productId) {
      this.isSubmitting.set(true);

      this.productService.updateProduct(this.productId, this.form.value).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.snackBar.open('Product updated successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.isSubmitting.set(false);
          console.error('Error updating product:', error);
          this.snackBar.open('Failed to update product. Please try again.', 'Close', { duration: 5000 });
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}

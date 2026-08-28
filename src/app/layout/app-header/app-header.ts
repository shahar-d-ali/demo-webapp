import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-app-header',
  imports: [],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
})
export class AppHeader {
  @Output() menuToggle = new EventEmitter<void>();

  onMenuToggle(): void {
    this.menuToggle.emit();
  }
}

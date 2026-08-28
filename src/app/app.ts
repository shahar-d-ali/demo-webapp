import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from './layout/app-header/app-header';
import { AppSidebar } from './layout/app-sidebar/app-sidebar';
import { IconSprite } from './shared/icon-sprite/icon-sprite';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSidenavModule, AppHeader, AppSidebar, IconSprite],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  isSidebarOpened = true;

  toggleSidebar(): void {
    this.isSidebarOpened = !this.isSidebarOpened;
  }
}

import { Component } from '@angular/core';

/**
 * Hidden SVG sprite of the Modernist line-icon set. Mount once (in app.html) and
 * reference icons elsewhere as `<svg width="18" height="18"><use href="#i-x"/></svg>`.
 */
@Component({
  selector: 'app-icon-sprite',
  standalone: true,
  templateUrl: './icon-sprite.html',
})
export class IconSprite {}

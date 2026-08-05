import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class App {
  protected readonly navLinks = [
    { path: '/', label: 'Inicio', icon: 'home', exact: true },
    { path: '/quiz', label: 'Quiz', icon: 'quiz', exact: false },
    { path: '/lab', label: 'Refactor Lab', icon: 'build', exact: false },
    { path: '/live-coding', label: 'Live Coding', icon: 'terminal', exact: false },
  ];
}

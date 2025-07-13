import { Component, signal } from '@angular/core';
import { SnakeGameComponent } from './snake-game.component';

@Component({
  selector: 'app-root',
  imports: [SnakeGameComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('snake444');
}

import { Component, HostListener, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Point {
  x: number;
  y: number;
}

type Direction = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

@Component({
  selector: 'snake-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="snake-game-container">
      <h2>Snake Game</h2>
      <div class="game-board">
        <div
          *ngFor="let cell of board; let i = index"
          class="cell"
          [ngClass]="{
            'snake': isSnake(cell),
            'food': isFood(cell)
          }"
        ></div>
      </div>
      <div class="game-controls">
        <button (click)="restartGame()">Restart</button>
        <span>Score: {{ score }}</span>
      </div>
      <div *ngIf="gameOver" class="game-over">
        <h3>Game Over!</h3>
        <p>Your score: {{ score }}</p>
        <button (click)="restartGame()">Play Again</button>
      </div>
    </div>
  `,
  styles: [`
    .snake-game-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      background: #181824;
      border-radius: 16px;
      box-shadow: 0 4px 32px rgba(0,0,0,0.2);
      padding: 2rem;
      color: #fff;
      position: relative;
    }
    .game-board {
      display: grid;
      grid-template-rows: repeat(20, 20px);
      grid-template-columns: repeat(20, 20px);
      gap: 2px;
      background: #22223b;
      border: 2px solid #4a4e69;
      margin-bottom: 1rem;
    }
    .cell {
      width: 20px;
      height: 20px;
      background: #22223b;
      border-radius: 4px;
      transition: background 0.1s;
    }
    .cell.snake {
      background: linear-gradient(135deg, #00f260, #0575e6);
    }
    .cell.food {
      background: linear-gradient(135deg, #ff512f, #dd2476);
    }
    .game-controls {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    button {
      background: #4a4e69;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 0.5rem 1.5rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover {
      background: #9a8c98;
    }
    .game-over {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(24,24,36,0.95);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      z-index: 2;
    }
    .game-over h3 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .game-over p {
      margin-bottom: 1rem;
    }
  `]
})
export class SnakeGameComponent implements OnInit, OnDestroy {
  boardSize = 20;
  board: Point[] = [];
  snake: Point[] = [];
  direction: Direction = 'ArrowRight';
  nextDirection: Direction = 'ArrowRight';
  food: Point = { x: 10, y: 10 };
  score = 0;
  gameOver = false;
  intervalId: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.initBoard();
    this.restartGame();
  }

  initBoard() {
    this.board = [];
    for (let y = 0; y < this.boardSize; y++) {
      for (let x = 0; x < this.boardSize; x++) {
        this.board.push({ x, y });
      }
    }
  }

  isSnake(cell: Point): boolean {
    return this.snake.some(segment => segment.x === cell.x && segment.y === cell.y);
  }

  isFood(cell: Point): boolean {
    return this.food.x === cell.x && this.food.y === cell.y;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const keyMap: { [key: string]: Direction } = {
      ArrowUp: 'ArrowUp',
      ArrowDown: 'ArrowDown',
      ArrowLeft: 'ArrowLeft',
      ArrowRight: 'ArrowRight',
      w: 'ArrowUp',
      s: 'ArrowDown',
      a: 'ArrowLeft',
      d: 'ArrowRight',
      W: 'ArrowUp',
      S: 'ArrowDown',
      A: 'ArrowLeft',
      D: 'ArrowRight',
    };
    const dir = keyMap[event.key];
    if (dir) {
      this.setDirection(dir);
    }
  }

  setDirection(dir: Direction) {
    // Prevent snake from reversing
    if (
      (dir === 'ArrowUp' && this.direction === 'ArrowDown') ||
      (dir === 'ArrowDown' && this.direction === 'ArrowUp') ||
      (dir === 'ArrowLeft' && this.direction === 'ArrowRight') ||
      (dir === 'ArrowRight' && this.direction === 'ArrowLeft')
    ) {
      return;
    }
    this.nextDirection = dir;
  }

  startGameLoop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => this.gameTick(), 100);
  }

  gameTick() {
    if (this.gameOver) return;
    this.direction = this.nextDirection;
    const head = { ...this.snake[0] };
    switch (this.direction) {
      case 'ArrowUp': head.y--; break;
      case 'ArrowDown': head.y++; break;
      case 'ArrowLeft': head.x--; break;
      case 'ArrowRight': head.x++; break;
    }
    // Check collision
    if (
      head.x < 0 || head.x >= this.boardSize ||
      head.y < 0 || head.y >= this.boardSize ||
      this.snake.some(seg => seg.x === head.x && seg.y === head.y)
    ) {
      this.gameOver = true;
      clearInterval(this.intervalId);
      this.cdr.detectChanges();
      return;
    }
    this.snake.unshift(head);
    // Check food
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.placeFood();
    } else {
      this.snake.pop();
    }
    this.cdr.detectChanges();
  }

  placeFood() {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * this.boardSize),
        y: Math.floor(Math.random() * this.boardSize)
      };
    } while (this.snake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
    this.food = newFood;
  }

  restartGame() {
    this.snake = [
      { x: 8, y: 10 },
      { x: 7, y: 10 },
      { x: 6, y: 10 }
    ];
    this.direction = 'ArrowRight';
    this.nextDirection = 'ArrowRight';
    this.score = 0;
    this.gameOver = false;
    this.placeFood();
    this.startGameLoop();
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
} 
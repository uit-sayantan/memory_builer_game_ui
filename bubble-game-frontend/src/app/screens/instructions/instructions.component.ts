import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStateService } from '../../state/game-state.service';

@Component({
  selector: 'app-instructions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss'
})
export class InstructionsComponent {
  understood = false;

  constructor(private router: Router, private state: GameStateService) {}

  onStart() {
    if (!this.understood) return;
    this.state.resetForNewGame(); // points=0, visited=0, etc.
    this.router.navigateByUrl('/game');
  }
}

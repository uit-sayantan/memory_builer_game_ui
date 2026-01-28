import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameStateService } from '../../state/game-state.service';

@Component({
  selector: 'app-launch',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './launch.component.html',
  styleUrl: './launch.component.scss'
})
export class LaunchComponent {
  username = '';
  topic = '';

  topics = ['Java', 'Python', 'Cloud', 'Security', 'DevOps', 'AI'];

  constructor(private router: Router, private state: GameStateService) {}

  get canLaunch() {
    return this.username.trim().length > 0 && this.topic.trim().length > 0;
  }

  onLaunch() {
    if (!this.canLaunch) return;
    this.state.setProfile(this.username.trim(), this.topic.trim());
    this.router.navigateByUrl('/instructions');
  }
}

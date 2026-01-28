import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderOverlayComponent } from './shared/loader/loader-overlay.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderOverlayComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('bubble-game');
  //audioCorrect = new Audio('assets/sounds/correct-answer.mp3');
  //audioWrong = new Audio('assets/sounds/wrong-answer.mp3');
  //audioBubblePop = new Audio('assets/sounds/bubble-pop.mp3');

  playSound(type: string) {
    switch (type) {
      case 'correct':
        //this.audioCorrect.play();
        console.log('correct answer sound');
        break;
      case 'wrong':
        //this.audioWrong.play();
        console.log('wrong answer sound');
        break;
      case 'bubblePop':
        //this.audioBubblePop.play();
        console.log('bubble pop sound');
        break;
      default:
        break;
    }
  }
}

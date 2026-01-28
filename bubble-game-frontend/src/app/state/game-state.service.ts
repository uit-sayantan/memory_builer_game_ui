import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  username = '';
  topic = '';

  points = 0;
  questionsVisited = 0;
  accuracy = 0;

  timeElapsedSec = 0;

  bubbleCount = 0;

  setProfile(username: string, topic: string) {
    this.username = username;
    this.topic = topic;
  }

  resetForNewGame() {
    this.points = 0;
    this.questionsVisited = 0;
    this.accuracy = 0;
    this.timeElapsedSec = 0;
    this.bubbleCount = 0;
  }

  recomputeAccuracy() {
    if (this.questionsVisited <= 0) {
      this.accuracy = 0;
      return;
    }
    const raw = (this.points / this.questionsVisited) * 100;
    this.accuracy = Math.max(0, Math.floor(raw)); // consistent: floor
  }
}

import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-question-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-modal.component.html',
  styleUrls: ['./question-modal.component.scss'],
})
export class QuestionModalComponent implements OnInit {
  @Input() question: any;
  @Input() timeLimit: number = 30;
  @Output() answerSelected = new EventEmitter<string>(); // Emit selected answer
  @Output() skipQuestion = new EventEmitter<void>(); // Emit skip event
  @Output() remainingTimeUpdate = new EventEmitter<number>(); // Emit remaining time updates
  remainingTime: number = this.timeLimit;
  selectedAnswer: string | null = null;
  timer: any;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.startTimer();
  }

 startTimer() {
  this.remainingTime = this.timeLimit;  // Reset the time every time a new question is shown
  this.timer = setInterval(() => {
    this.remainingTime--;
    //console.log('Remaining time:', this.remainingTime);
    this.cdRef.detectChanges();
    if (this.remainingTime <= 0) {
      clearInterval(this.timer);
      this.emitAnswer('timeout');
    }
  }, 1000);
}

  onAnswer(answer: string) {
    if (this.selectedAnswer) return; // Prevent multiple answers
    this.selectedAnswer = answer;
    clearInterval(this.timer);
    this.emitAnswer(answer);
  }

  emitAnswer(answer: string) {
    this.answerSelected.emit(answer);
    this.remainingTimeUpdate.emit(this.remainingTime);
  }

  onSkip() {
    clearInterval(this.timer);
    this.skipQuestion.emit();
    this.remainingTimeUpdate.emit(this.remainingTime);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}

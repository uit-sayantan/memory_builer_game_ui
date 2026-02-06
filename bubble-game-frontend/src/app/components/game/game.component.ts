import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { BubbleComponent } from '../bubble/bubble.component';
import { HeaderComponent } from '../header/header.component';
import { GameStateService } from '../../state/game-state.service';
import { QuestionModalComponent } from '../question-modal/question-modal.component';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../shared/loader/loader.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  standalone: true,
  imports: [BubbleComponent,
            CommonModule,
            HeaderComponent,
            QuestionModalComponent
  ],
})
export class GameComponent implements OnInit {
  username: string = '';
  selectedTopic: string = '';
  bubbles: any[] = [];
  points: number = 0;
  accuracy: number = 0;
  timeElapsed: number = 0;
  currentQuestion: any = null;
  nextQuestion: any = null;
  showQuestionModal = false;
  clickedBubbleId: number | null = null; // To track clicked bubble
  totalQuestionsVisited: number = 0;

  constructor(private gameService: GameService, public state: GameStateService, private loader: LoaderService) {}

  ngOnInit(): void {
    this.loader.show();
    this.gameService.getQuestion().subscribe((question) => {
      this.nextQuestion = question;
      this.loader.hide();
      this.createBubbles(true,0);  // Initialize bubbles with fixed positions
    });
  }

  createBubbles(isInitial: boolean = false, newBubbleCount: number, isWrong: boolean = false) {
    let bubbleCount: number = 0;
    if(isInitial) {
     bubbleCount = 5 + Math.floor(Math.random() * 4);
    } else {
     bubbleCount = newBubbleCount;
     //console.log('Adding', bubbleCount, 'new bubbles');
    }
    const existingBubbleIds = this.bubbles.map(bubble => bubble.id);
    const newBubbles = [];

    for (let i = 0; i < bubbleCount; i++) {
      const newBubble = {
        id: this.bubbles.length + i,
        color: `hsl(${Math.random() * 360}, 100%, 60%)`,
        size: 50 + Math.random() * 30,
        top: `${Math.random() * 80}`,
        left: `${Math.random() * 80}`,
        isWrong: isWrong,
        isSpawning: true  // Set spawning flag for new bubbles
      };
      //console.log('Creating bubble:', newBubble);
      if (isInitial) {
        // Check for overlap on initial creation and prevent it
        let isOverlapping= false;
        do {
          isOverlapping = false;
          //console.log('Checking overlaps for bubble:', newBubble);
          for (const bubble of this.bubbles) {
            if (this.checkOverlap(newBubble, bubble)) {
              isOverlapping = true;
              break;
            }
          }
          if (isOverlapping) {
            newBubble.top = `${Math.random() * 80}`;
            newBubble.left = `${Math.random() * 80}`;
          }
        } while (isOverlapping);
      }

      newBubbles.push(newBubble);
    }
    //console.log('Created bubbles:', newBubbles);

    this.bubbles = [...this.bubbles, ...newBubbles];
    //console.log('Total bubbles after addition:', this.bubbles.length);
  }

  checkOverlap(bubble1: any, bubble2: any) {
    const distanceX = Math.abs(parseFloat(bubble1.left) - parseFloat(bubble2.left));
    const distanceY = Math.abs(parseFloat(bubble1.top) - parseFloat(bubble2.top));
    const minDistance = Math.max(bubble1.size, bubble2.size)/2;
    return distanceX < minDistance && distanceY < minDistance;
  }

  onBubbleClick(bubbleId: number) {
    this.totalQuestionsVisited++;
    this.clickedBubbleId = bubbleId; // Store the ID of the clicked bubble
    this.currentQuestion = JSON.parse(JSON.stringify(this.nextQuestion));
    this.showQuestionModal = true;
    this.nextQuestion = null;
    this.gameService.getQuestion().subscribe((question) => {
      this.nextQuestion = question;   
    });
  }

  onAnswerSelected(answer: string) {
    if(answer === 'timeout') {
     // console.log('Time out! No answer selected.');
      this.onSkipQuestion();
      return;
    } 
    const correctAnswerIndex = this.currentQuestion.correct_answer;
    const correctAnswerText = this.currentQuestion[`answer_${correctAnswerIndex}`];

    if (answer === correctAnswerText) {
      //console.log('Correct answer!');
      this.points++;
      this.removeBubble(); // Remove the exact bubble that was clicked
    } else {
      console.log('Wrong answer!');
      this.points--;
      this.createBubbles(false, 2, true); // Add 2 new bubbles for wrong answer with isWrong=true
      //console.log('Correct answer was:', correctAnswerText);
    }

    this.state.recomputeAccuracy();
    this.showQuestionModal = false; // Hide modal after selection
    this.updateAccuracy();
    this.checkGameStatus();
  }

  onSkipQuestion() {
    //this.points = Math.max(0, this.points);
    this.createBubbles(false,1); // Add 1 new bubble on skip
    this.showQuestionModal = false; // Hide modal
    this.updateAccuracy();
    this.checkGameStatus();
  }

  calculateTimeElapsed(seconds: number) {
    this.timeElapsed += (this.currentQuestion.available_time_limit - seconds);
  }

  addBubble() {
    this.createBubbles(false,0); // Adds 1 new bubble
  }

  removeBubble() {
    if (this.clickedBubbleId !== null) {
      // Find and remove the bubble with the clicked ID
      const bubbleIndex = this.bubbles.findIndex(bubble => bubble.id === this.clickedBubbleId);
      if (bubbleIndex !== -1) {
        this.bubbles.splice(bubbleIndex, 1); // Remove the exact bubble
      }
      this.clickedBubbleId = null; // Reset clicked bubble ID
    }
  }

  updateAccuracy() {
    if(this.points <= 0) {
      this.accuracy = 0;
      return;
    } 
    this.accuracy = Math.floor((this.points / this.totalQuestionsVisited) * 100);
    console.log('Updated accuracy:', this.accuracy);
  }

  checkGameStatus() {
    if (this.bubbles.length === 0) {
      alert('You won!');
    } else if (this.bubbles.length > 20) {
      alert('Game Over!');
    }
  }
}

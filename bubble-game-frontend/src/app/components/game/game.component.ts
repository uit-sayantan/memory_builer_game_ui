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
  clickedBubbleId: number | null = null;
  totalQuestionsVisited: number = 0;
  particles: any[] = [];
  burstRings: any[] = [];
  showCongratulations = false;
  showWrongAnswer = false;
  burstingBubbleId: number | null = null;
  celebrationPosition = { left: 50, top: 50 };
  celebrationAnimation = 'floatUp';
  wrongAnimation = 'wrongFloatUp';
  correctAudio: HTMLAudioElement | null = null; // NEW
  wrongAudio: HTMLAudioElement | null = null; // NEW

  constructor(private gameService: GameService, public state: GameStateService, private loader: LoaderService) {}

  ngOnInit(): void {
    this.loader.show();
    this.gameService.getQuestion().subscribe((question) => {
      this.nextQuestion = question;
      this.loader.hide();
      this.createBubbles(true,0);  // Initialize bubbles with fixed positions
    });
    this.initializeAudio(); // NEW - Initialize audio on component load
  }

  // NEW - Initialize Audio Files
  initializeAudio() {
    this.correctAudio = new Audio();
    this.correctAudio.src = 'audio/correct.mp3';
    this.correctAudio.preload = 'auto';
    this.correctAudio.onerror = (e) => console.log('Correct audio error:', e);
    
    this.wrongAudio = new Audio();
    this.wrongAudio.src = 'audio/wrong.mp3';
    this.wrongAudio.preload = 'auto';
    this.wrongAudio.onerror = (e) => console.log('Wrong audio error:', e);
  }

  createBubbles(isInitial: boolean = false,newBubbleCount: number) {
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
        left: `${Math.random() * 80}`
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

  // MODIFIED - Play Audio Function
  playAudio(type: 'correct' | 'wrong') {
    try {
      const audio = type === 'correct' ? this.correctAudio : this.wrongAudio;
      
      if (!audio) {
        console.log('Audio not initialized');
        return;
      }

      // Reset and play
      audio.currentTime = 0;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => console.log(`${type} audio playing`))
          .catch(err => console.log(`${type} audio failed:`, err));
      }
    } catch (error) {
      console.log('Audio error:', error);
    }
  }

  // NEW FUNCTION - Create Burst Particles
  createBurstParticles(burstX: number, burstY: number) {
    const particleCount = 12 + Math.floor(Math.random() * 8);
    const newParticles = [];
    const particles = ['✨', '⭐', '💫', '🌟'];
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const velocity = 80 + Math.random() * 150;
      const randomParticle = particles[Math.floor(Math.random() * particles.length)];
      
      newParticles.push({
        id: Math.random(),
        left: burstX,
        top: burstY,
        angle: angle,
        velocity: velocity,
        duration: 700 + Math.random() * 300,
        particle: randomParticle,
        size: 1 + Math.random() * 0.5
      });
    }
    
    this.particles = newParticles;
    this.createBurstRings(burstX, burstY);
    
    setTimeout(() => {
      this.particles = [];
      this.burstRings = [];
    }, 1000);
  }

  // NEW FUNCTION - Create Burst Rings
  createBurstRings(burstX: number, burstY: number) {
    const ringCount = 3;
    const newRings = [];
    
    for (let i = 0; i < ringCount; i++) {
      newRings.push({
        id: Math.random(),
        left: burstX,
        top: burstY,
        delay: i * 50,
        size: 40 + (i * 20)
      });
    }
    
    this.burstRings = newRings;
  }

  // NEW FUNCTION - Random Animation
  getRandomAnimation(type: 'celebration' | 'wrong'): string {
    const random = Math.random();
    if (type === 'celebration') {
      if (random < 0.33) return 'floatUp';
      if (random < 0.66) return 'floatUpLeft';
      return 'floatUpRight';
    } else {
      if (random < 0.33) return 'wrongFloatUp';
      if (random < 0.66) return 'wrongFloatUpLeft';
      return 'wrongFloatUpRight';
    }
  }

  // MODIFIED FUNCTION - Answer Selection
  onAnswerSelected(answer: string) {
    if(answer === 'timeout') {
      this.onSkipQuestion();
      return;
    } 
    const correctAnswerIndex = this.currentQuestion.correct_answer;
    const correctAnswerText = this.currentQuestion[`answer_${correctAnswerIndex}`];

    if (answer === correctAnswerText) {
      // CORRECT ANSWER
      this.burstingBubbleId = this.clickedBubbleId;
      this.celebrationAnimation = this.getRandomAnimation('celebration');
      
      this.celebrationPosition = {
        left: 50 + (Math.random() * 20 - 10),
        top: 40 + (Math.random() * 10 - 5)
      };
      
      this.showCongratulations = true;
      this.playAudio('correct'); // PLAY CORRECT SOUND
      this.createBurstParticles(this.celebrationPosition.left, this.celebrationPosition.top);
      this.points++;
      
      setTimeout(() => {
        this.removeBubble();
        this.burstingBubbleId = null;
      }, 800);
      
      setTimeout(() => {
        this.showCongratulations = false;
      }, 800);
      
    } else {
      // WRONG ANSWER
      this.wrongAnimation = this.getRandomAnimation('wrong');
      this.showWrongAnswer = true;
      this.playAudio('wrong'); // PLAY WRONG SOUND
      this.points--;
      this.createBubbles(false, 2);
      
      setTimeout(() => {
        this.showWrongAnswer = false;
      }, 800);
    }

    this.state.recomputeAccuracy();
    this.showQuestionModal = false;
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

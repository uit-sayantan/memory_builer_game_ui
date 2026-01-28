import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
})
export class HeaderComponent implements OnChanges {
  @Input() username: string = '';
  @Input() accuracy: number = 0;
  @Input() timeElapsed: number = 0;

  formattedTime: string = ''; // Holds the formatted time

  ngOnChanges(changes: SimpleChanges): void {
    // Call the method whenever timeElapsed changes
    if (changes['timeElapsed']) {
      this.formatTime();
    }
  }

  // This method will format the time to show minutes:seconds when time crosses 60 seconds
  formatTime() {
    if (this.timeElapsed < 60) {
      // Show seconds if time is less than 60
      this.formattedTime = `${this.timeElapsed}s`;
    } else {
      // Show minutes:seconds when time exceeds 60
      const minutes = Math.floor(this.timeElapsed / 60);
      const seconds = this.timeElapsed % 60;
      this.formattedTime = `${minutes}m ${seconds}s`;
    }
  }
}

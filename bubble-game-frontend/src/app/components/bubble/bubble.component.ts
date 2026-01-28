import { Component, Input, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bubble',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.scss']
})
export class BubbleComponent implements OnInit {
  @Input() color: string = 'blue';
  @Input() size: number = 50;
  @Input() id: number = 0;
  @Input() top: number = 0;
  @Input() left: number = 0;

  isHovered: boolean = false;
  bubbleGradient = '';

  ngOnInit(): void {
    // Create glossy gradient dynamically from input color
    this.bubbleGradient = `
      radial-gradient(
        circle at 30% 30%,
        rgba(255,255,255,0.9),
        ${this.color} 60%
      )
    `;
  }

  @HostListener('mouseenter') onHover() {
    this.isHovered = true;
  }

  @HostListener('mouseleave') onLeave() {
    this.isHovered = false;
  }

  onClick() {
    // visual feedback handled by CSS
  }
}

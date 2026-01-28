import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-backdrop" *ngIf="loader.loading$ | async">
      <div class="loader-card" role="status" aria-live="polite" aria-label="Loading">
        <div class="loader-title">Loading…</div>

        <!-- progress bar -->
        <div class="bar">
          <div class="bar-fill"></div>
        </div>

        <div class="loader-sub">Fetching questions…</div>
      </div>
    </div>
  `,
  styles: [`
    .loader-backdrop{
      position: fixed;
      inset: 0;
      z-index: 9999;
      display:flex;
      align-items:center;
      justify-content:center;
      background: rgba(0,0,0,0.35);
      backdrop-filter: blur(6px);
    }

    .loader-card{
      width: min(420px, calc(100vw - 32px));
      border-radius: 18px;
      padding: 18px 18px 16px;
      background: rgba(20,20,30,0.75);
      border: 1px solid rgba(255,255,255,0.12);
      box-shadow: 0 18px 60px rgba(0,0,0,0.35);
      color: #fff;
      text-align: center;
      animation: popIn .18s ease-out;
    }

    .loader-title{
      font-size: 16px;
      font-weight: 700;
      letter-spacing: .2px;
      margin-bottom: 12px;
    }

    .loader-sub{
      margin-top: 10px;
      font-size: 12px;
      opacity: .8;
    }

    .bar{
      height: 10px;
      width: 100%;
      border-radius: 999px;
      overflow: hidden;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.10);
    }

    .bar-fill{
      height: 100%;
      width: 35%;
      border-radius: 999px;
      background: linear-gradient(90deg, rgba(122,247,255,0.95), rgba(255,136,221,0.95));
      animation: indeterminate 1.1s ease-in-out infinite;
      will-change: transform, width;
    }

    @keyframes indeterminate{
      0%   { transform: translateX(-120%); width: 30%; }
      50%  { transform: translateX(60%);   width: 55%; }
      100% { transform: translateX(220%);  width: 30%; }
    }

    @keyframes popIn{
      from { transform: translateY(8px) scale(0.98); opacity: 0; }
      to   { transform: translateY(0)   scale(1);    opacity: 1; }
    }

    @media (prefers-reduced-motion: reduce){
      .loader-card{ animation: none; }
      .bar-fill{ animation: none; width: 100%; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderOverlayComponent {
  constructor(public loader: LoaderService) {}
}

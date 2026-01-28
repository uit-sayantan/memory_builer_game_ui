import { Routes } from '@angular/router';
import { InstructionsComponent } from './screens/instructions/instructions.component';
import { GameComponent } from './components/game/game.component';
import { LaunchComponent } from './screens/launch/launch.component';

export const routes: Routes = [
  { path: '', component: LaunchComponent },
  { path: 'instructions', component: InstructionsComponent },
  { path: 'game', component: GameComponent },
  { path: '**', redirectTo: '' }
];

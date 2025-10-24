import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { signal } from '@angular/core';

interface GameMode {
  name: string;
  description: string;
  route: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
    .main-color {
      color: #9D1616;
    }
    .button-bg {
      background-color: #FDFAFA;
    }
    .focus-ring {
      box-shadow: 0 0 0 4px rgba(157, 22, 22, 0.5);
    }
  `
  ],
  template: `
    <main class="flex-grow p-4 sm:p-8 mx-auto w-full min-h-[calc(100vh-8rem)] bg-gray-50">
      <div class="h-full flex flex-col items-center justify-center">
        <div class="flex flex-col gap-4 w-full max-w-lg mx-auto">
          @for (mode of modes(); track mode.name) {
            <button 
              [routerLink]="mode.route"
              [attr.aria-label]="mode.description"
              class="mode-button button-bg flex items-center justify-center w-full min-h-[80px] p-4 sm:p-6 rounded-2xl border-2 border-gray-200 shadow-lg transition-all duration-300 transform hover:bg-[#FFF5F5] hover:shadow-xl hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-[#9D1616] focus:ring-opacity-50"
              (click)="selectMode(mode)"
            >
              <span class="text-2xl font-bold main-color tracking-wider">
                {{ mode.name }}
              </span>
            </button>
          }
        </div>
        @if (selectedMode()) {
          <div class="mt-10 text-center text-xl text-gray-700 p-4 border-t-2 border-[#9D1616] bg-white rounded-xl shadow-md">
            คุณเลือกโหมด: 
            <span class="font-extrabold text-2xl main-color">{{ selectedMode()?.name }}</span>
            <p class="text-base text-gray-500 mt-1">{{ selectedMode()?.description }}</p>
          </div>
        }
      </div>
    </main>
  `
})
export class MainComponent {
  modes = signal<GameMode[]>([
    // { name: 'โฆษณา', description: 'โฆษณา', route: '/puzzle' },
    { name: 'ทำทดสอบก่อนเรียน', description: 'ทำทดสอบก่อนเรียน', route: '/pretest' },
  ]);
  selectedMode = signal<GameMode | null>(null);

  selectMode(mode: GameMode): void {
    this.selectedMode.set(mode);
    console.log(`เลือกโหมด: ${mode.name}`);
  }
}
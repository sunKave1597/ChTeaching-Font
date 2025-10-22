import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface GameMode {
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-puzzle',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
    .main-color {
      color: #9D1616;
    }
    .button-bg {
      background-color: #FDFAFA;
    }
  `
  ],
  template: `
    <main class="flex-grow p-4 sm:p-8 max-w-7xl mx-auto w-full min-h-[calc(100vh-8rem)]">
      <div class="h-full flex flex-col items-center justify-center">
        <div class="flex flex-col gap-4 w-full max-w-xl mx-auto">
          @for (mode of modes(); track mode.name) {
            <button 
              (click)="selectMode(mode)"
              [attr.aria-label]="mode.description"
              class="mode-button button-bg flex items-center justify-center
                     w-full min-h-[80px] p-4 sm:p-6 rounded-xl border border-gray-100 shadow-md 
                     transition-all duration-300 hover:bg-[#F0F0F0] hover:shadow-lg 
                     focus:outline-none focus:ring-4 focus:ring-[#9D1616] focus:ring-opacity-50">
              <ng-container [ngSwitch]="mode.icon">
                @switch (mode.icon) {
                  @case ('lightbulb') {
                    <svg class="w-8 h-8 mr-4 main-color flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  }
                  @case ('magnifying-glass') {
                    <svg class="w-8 h-8 mr-4 main-color flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                  @case ('headphones') {
                    <svg class="w-8 h-8 mr-4 main-color flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l1.293-1.293a1 1 0 01.707-.293h7.293a1 1 0 01.707.293l1.293 1.293H20a1 1 0 011 1v4a1 1 0 01-1 1h-.586a1 1 0 01-.707-.293L17.586 15z" />
                    </svg>
                  }
                }
              </ng-container>
              <span class="text-xl font-bold main-color">
                {{ mode.name }}
              </span>
            </button>
          }
        </div>
        @if (selectedMode()) {
          <div class="mt-8 text-center text-xl text-gray-700 p-4 border-t border-gray-200">
            คุณเลือกโหมด: <span class="font-bold main-color">{{ selectedMode()?.name }}</span>
          </div>
        }
      </div>
    </main>
  `
})
export class PuzzleContainer {
  modes = signal<GameMode[]>([
    { name: 'บัตรคำศัพท์', icon: 'lightbulb', description: 'ไอคอน หลอดไฟ บัตรคำศัพท์' },
    { name: 'ทายคำศัพท์', icon: 'magnifying-glass', description: 'ไอคอน แว่นขยาย ทายคำศัพท์' },
    { name: 'เกมส์ฝึกฟัง', icon: 'headphones', description: 'ไอคอน หูฟัง เกมส์ฝึกฟัง' },
  ]);

  selectedMode = signal<GameMode | null>(null);

  constructor(private router: Router) {}

  selectMode(mode: GameMode): void {
    this.selectedMode.set(mode);
    if (mode.name === 'ทายคำศัพท์') {
      this.router.navigateByUrl('/puzzle/guess-word');
    } else {
      console.log(`เลือกโหมด: ${mode.name}`);
    }
  }
}
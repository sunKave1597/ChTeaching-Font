import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../env';
import { CommonModule } from '@angular/common';
import { FontSizeService } from '../../font-size.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../../spinner.service';
import { Observable } from 'rxjs';

interface Vocabulary {
  _id: string;
  chWord: string;
  pinYin: string;
  thWord: string;
}

@Component({
  selector: 'app-flashcards',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      
      @if (isLoading$ | async) {
        <div class="flex flex-col items-center justify-center h-96">
          <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-[#9D1616]"></div>
          <p class="mt-4 text-lg text-gray-600">Loading vocabulary...</p>
        </div>
      } @else if (vocabularies.length === 0) {
        <div class="flex flex-col items-center justify-center h-96 text-center">
          <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          <p class="text-xl text-gray-600">No vocabulary available</p>
        </div>
      } @else {
        <!-- กล่องเต็มจอทั้งหมด -->
        <div #fullscreenBox 
             class="relative w-full max-w-2xl mx-auto flex flex-col items-center"
             [class.fullscreen-all]="isFullscreen">
          
          <!-- ปุ่มย่อ (มุมขวาบน) - แสดงเฉพาะตอนขยาย -->
          @if (isFullscreen) {
            <button (click)="toggleFullscreen()"
                    class="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white shadow-md transition z-50">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          }

          <!-- การ์ดคำศัพท์ (อยู่กึ่งกลาง) -->
          <div class="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 text-center w-full transition-all duration-300 flex-1 flex flex-col justify-center"
               [class.fullscreen-card]="isFullscreen">
            <div class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#9D1616] mb-3 sm:mb-4">
              {{ current?.chWord }}
            </div>
            <div class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-700 mb-2">
              {{ current?.pinYin }}
            </div>
            <div class="text-lg sm:text-xl md:text-2xl text-gray-500">
              {{ current?.thWord }}
            </div>
          </div>

          <!-- ปุ่มควบคุม (ซ่อนตอนขยาย) -->
          @if (!isFullscreen) {
            <div class="flex flex-col items-center gap-3 sm:gap-4 mt-6 sm:mt-8 w-full mb-20 sm:mb-24">
              <div class="flex justify-center gap-6 sm:gap-8 w-full">
                <button (click)="prev()" [disabled]="index === 0"
                        class="p-3 sm:p-4 bg-[#9D1616] text-white rounded-full hover:bg-[#7B1111] disabled:opacity-50 disabled:cursor-not-allowed transition">
                  <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>

                <button (click)="toggleFullscreen()"
                        class="px-5 sm:px-6 py-3 sm:py-4 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 font-medium text-sm sm:text-base transition whitespace-nowrap">
                  Zoom
                </button>

                <button (click)="next()" [disabled]="index === vocabularies.length - 1"
                        class="p-3 sm:p-4 bg-[#9D1616] text-white rounded-full hover:bg-[#7B1111] disabled:opacity-50 disabled:cursor-not-allowed transition">
                  <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>

              <div class="text-sm text-gray-500">
                {{ index + 1 }} / {{ vocabularies.length }}
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    /* กล่องเต็มจอทั้งหมด */
    .fullscreen-all {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 1.5rem !important;
      z-index: 9999;
      background: rgba(255, 255, 255, 0.98);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    /* การ์ดขยายเต็มจอ - อยู่กึ่งกลาง */
    .fullscreen-card {
      width: 100% !important;
      max-width: none !important;
      min-height: 60vh;
      padding: 3rem !important;
      border-radius: 2.5rem !important;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3) !important;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* มือถือแนวนอน */
    @media (max-height: 500px) and (orientation: landscape) {
      .fullscreen-all {
        padding: 1rem !important;
      }
      .fullscreen-card {
        padding: 1.5rem !important;
        min-height: 55vh;
      }
    }

    @media (max-width: 640px) {
      .fullscreen-card {
        padding: 2rem !important;
        border-radius: 2rem !important;
        min-height: 65vh;
      }
    }

    /* ปุ่มย่อ มุมขวาบน */
    .fullscreen-all button.absolute {
      top: 1rem;
      right: 1rem;
    }
  `]
})
export class FlashcardsComponent implements OnInit {
  @ViewChild('fullscreenBox') fullscreenBox!: ElementRef;

  vocabularies: Vocabulary[] = [];
  current: Vocabulary | null = null;
  index = 0;
  isFullscreen = false;
  isLoading$!: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private fontSizeService: FontSizeService,
    private router: Router,
    private spinnerService: SpinnerService,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoading$ = this.spinnerService.isLoading$;
  }

  ngOnInit() {
    this.loadVocabularies();
  }

  loadVocabularies() {
    this.spinnerService.show();
    this.http.get<Vocabulary[]>(`${environment.apiUrl}/words`).subscribe({
      next: (data) => {
        this.vocabularies = data;
        if (data.length > 0) {
          this.current = data[0];
        }
        this.spinnerService.hide();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load vocabulary:', err);
        this.vocabularies = [];
        this.current = null;
        this.spinnerService.hide();
        this.cdr.markForCheck();
      }
    });
  }

  prev() {
    if (this.index > 0) {
      this.index--;
      this.current = this.vocabularies[this.index];
      this.cdr.markForCheck();
    }
  }

  next() {
    if (this.index < this.vocabularies.length - 1) {
      this.index++;
      this.current = this.vocabularies[this.index];
      this.cdr.markForCheck();
    }
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;

    if (this.isFullscreen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    this.cdr.markForCheck();
  }
}
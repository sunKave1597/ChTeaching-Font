import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../env';

interface WordImage {
  _id: string;
  kind: string;
  caption: string;
  contentType: string;
  dataUrl: string;
}

interface Word {
  _id: string;
  chWord: string;
  pinYin: string;
  thWord: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  images: WordImage[];
}

interface Category {
  name: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .main-color { color: #9d1616; }
      .button-bg { background-color: #fdfafa; }
      .category-bg { background: linear-gradient(to right, #9d1616 30%, white 30%); }
      .word-bg { background: white; }
      .back-button {
        position: fixed;
        top: 1.5rem;
        left: 1.5rem;
        z-index: 50;
      }
      .loading-spinner {
        border: 6px solid #f3f3f3;
        border-top: 6px solid #9d1616;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
  ],
  template: `
    <main
      class="flex-grow p-4 sm:p-8 mx-auto w-full min-h-screen pb-32 flex flex-col"
      [class.category-bg]="!selectedCategory()"
      [class.word-bg]="selectedCategory()"
    >
      @if (selectedCategory()) {
        <button
          (click)="backToCategories()"
          class="back-button inline-flex items-center gap-2 text-[#9D1616] hover:text-[#7B1111] font-semibold bg-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          กลับไปเลือกหมวด
        </button>
      }

      <div class="flex-1 flex items-center justify-center">
        <div class="w-full max-w-2xl">

          @if (!selectedCategory()) {
            @if (isLoading()) {
              <div class="text-center py-20">
                <div class="loading-spinner mx-auto"></div>
                <p class="mt-6 text-xl text-gray-600">กำลังโหลดหมวดหมู่...</p>
              </div>
            } @else {
              <div class="flex flex-col gap-4 max-w-xl mx-auto">
                @for (category of categories(); track category.name) {
                  <button
                    (click)="selectCategory(category)"
                    class="text-center text-xl py-6 rounded-xl font-bold button-bg main-color border border-gray-100 shadow-md hover:bg-[#F0F0F0] hover:shadow-lg transition-all"
                  >
                    {{ category.name }}
                  </button>
                }
              </div>
            }
          } @else {
            <div class="text-center">
              <h2 class="text-3xl font-bold main-color mb-10 mt-20">
                {{ selectedCategory()!.name }}
              </h2>

              @if (isLoading()) {
                <div class="text-center py-20">
                  <div class="loading-spinner mx-auto"></div>
                  <p class="mt-6 text-xl text-gray-600">กำลังโหลดคำศัพท์...</p>
                </div>
              } @else if (words().length === 0) {
                <p class="text-2xl text-gray-500 mt-20">ไม่พบคำศัพท์ในหมวดนี้</p>
              } @else if (currentWord()) {
                <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-lg mx-auto">
                  @if (primaryImage(); as img) {
                    <img
                      [src]="fixBase64(img.dataUrl)"
                      [alt]="currentWord()!.thWord"
                      class="mx-auto w-80 h-80 object-cover rounded-2xl shadow-xl mb-8"
                    />
                  } @else {
                    <div class="mx-auto w-80 h-80 bg-gray-200 rounded-2xl flex items-center justify-center mb-8">
                      <span class="text-gray-500 text-xl">ไม่มีรูปภาพ</span>
                    </div>
                  }

                  <h1 class="text-6xl font-bold main-color mb-4">{{ currentWord()!.chWord }}</h1>
                  <p class="text-4xl text-gray-700 mb-6">{{ currentWord()!.pinYin }}</p>
                  <p class="text-5xl font-bold text-gray-900">{{ currentWord()!.thWord }}</p>

                  <div class="mt-12 flex justify-center gap-10 items-center">
                    <button
                      (click)="previousWord()"
                      [disabled]="currentIndex() === 0"
                      class="p-5 rounded-full bg-white shadow-xl disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-2xl transition-all"
                    >
                      <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <div class="text-2xl font-bold text-gray-700 min-w-32">
                      {{ currentIndex() + 1 }} / {{ words().length }}
                    </div>

                    <button
                      (click)="nextWord()"
                      [disabled]="currentIndex() >= words().length - 1"
                      class="p-5 rounded-full bg-white shadow-xl disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-2xl transition-all"
                    >
                      <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              }
            </div>
          }

        </div>
      </div>
    </main>
  `
})
export class BookContainer {
  categories = signal<Category[]>([]);
  selectedCategory = signal<Category | null>(null);
  words = signal<Word[]>([]);
  currentIndex = signal(0);
  currentWord = signal<Word | null>(null);
  isLoading = signal(false);

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading.set(true);
    this.http.get<any>(`${this.apiUrl}/words/69762161a4394de6abbceda3`).subscribe({
      next: (data) => {
        const wordsArray = Array.isArray(data) ? data : [data];
        const uniqueCategories = [...new Set(wordsArray.map((w: Word) => w.category))]
          .map(name => ({ name }));
        this.categories.set(uniqueCategories);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  selectCategory(category: Category) {
    this.selectedCategory.set(category);
    this.currentIndex.set(0);
    this.loadWordsByCategory(category.name);
  }

  loadWordsByCategory(categoryName: string) {
    this.isLoading.set(true);
    this.words.set([]);
    this.currentWord.set(null);

    this.http.get<any>(`${this.apiUrl}/words/69762161a4394de6abbceda3`).subscribe({
      next: (data) => {
        const wordsArray = Array.isArray(data) ? data : [data];
        const filtered = wordsArray.filter((w: Word) => w.category === categoryName);
        this.words.set(filtered);
        if (filtered.length > 0) {
          this.currentWord.set(filtered[0]);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.words.set([]);
        this.currentWord.set(null);
        this.isLoading.set(false);
      }
    });
  }

  nextWord() {
    const next = this.currentIndex() + 1;
    if (next < this.words().length) {
      this.currentIndex.set(next);
      this.currentWord.set(this.words()[next]);
    }
  }

  previousWord() {
    const prev = this.currentIndex() - 1;
    if (prev >= 0) {
      this.currentIndex.set(prev);
      this.currentWord.set(this.words()[prev]);
    }
  }

  backToCategories() {
    this.selectedCategory.set(null);
    this.words.set([]);
    this.currentWord.set(null);
    this.currentIndex.set(0);
  }

  primaryImage() {
    const word = this.currentWord();
    if (!word || !word.images?.length) return null;
    return word.images.find(img => img.kind === 'primary') || word.images[0];
  }

  fixBase64(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('data:image/jpeg;base64,data:image/jpeg;base64,')) {
      return 'data:image/jpeg;base64,' + url.split('base64,')[2];
    }
    return url;
  }
}
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { interval, Subscription, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SpinnerService } from '../../spinner.service';
import { AuthService } from '../../auth.service';
import { environment } from '../../env';

interface Question {
  questionId: string;
  text: string;
  options: string[];
  answerIndex: number;
  image: string;
}

interface Answer {
  question: Question;
  selectedAnswer: string;
  isCorrect: boolean;
}

interface QuizImageResponse {
  _id: string;
  quizId: string;
  questionId: string;
  kind: string;
  contentType: string;
  caption: string;
  base64Data: string;
  createdAt: string;
  updatedAt: string;
}

interface QuizResponse {
  type: string;
  total: number;
  limit: number;
  items: {
    type: string;
    category: string;
    quizId: string;
    questionId: string;
    text: string;
    options: string[];
    answerIndex: number;
  }[];
}

@Component({
  selector: 'app-guess-word-game',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <button
        (click)="returnToPuzzle()"
        class="absolute top-4 left-4 p-2 rounded-full bg-[#9D1616] text-white hover:bg-[#7B1111] transition duration-200 z-30"
        title="กลับสู่หน้าเกม"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      @if (isLoading$ | async) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-11/12 max-w-md sm:max-w-lg">
            <h2 class="text-lg font-semibold text-[#9D1616] mb-4">กำลังโหลด...</h2>
            <div class="flex justify-center">
              <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-[#9D1616]"></div>
            </div>
          </div>
        </div>
      }
      @if (showStartPopup && !(isLoading$ | async)) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div class="bg-white rounded-lg p-6 w-11/12 max-w-md sm:max-w-lg">
            <h2 class="text-lg font-semibold text-[#9D1616] mb-4">ทายคำศัพท์</h2>
            <p class="text-gray-700 mb-6">พร้อมที่จะเริ่มเกมหรือยัง?</p>
            <div class="flex justify-end">
              <button
                (click)="startGame()"
                class="px-4 py-2 bg-[#9D1616] text-white rounded-lg hover:bg-[#7B1111]"
              >
                เริ่ม
              </button>
            </div>
          </div>
        </div>
      }
      @if (showCountdown && !(isLoading$ | async)) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div class="bg-white rounded-lg p-6 w-11/12 max-w-md sm:max-w-lg">
            <h2 class="text-lg font-semibold text-[#9D1616] mb-4">เริ่มใน</h2>
            <div class="text-center text-4xl font-bold text-[#9D1616] mb-4">{{ countdown }}</div>
            <div class="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="absolute top-0 h-full bg-[#9D1616] transition-all duration-1000"
                [style.width.%]="(countdown / 3) * 100"
              ></div>
            </div>
          </div>
        </div>
      }
      @if (!showStartPopup && !showCountdown && !showSuccessPopup && !showGameOverPopup && !(isLoading$ | async)) {
        <div class="flex flex-col items-center w-full max-w-md sm:max-w-lg">
          <div class="text-center text-xl text-[#9D1616] mb-4">
            คำถามที่ {{ currentQuestionIndex + 1 }} / {{ questions.length }}
          </div>
          <div class="text-center text-lg font-semibold text-[#9D1616] mb-4">
            {{ currentQuestion.text }}
          </div>
          <div class="mb-4">
            @if (currentQuestion.image) {
              <img
                [src]="currentQuestion.image"
                [alt]="currentQuestion.text"
                class="w-64 h-64 object-cover rounded-lg shadow-md sm:w-80 sm:h-80"
                (error)="handleImageError($event)"
              />
            } @else {
              <div class="w-64 h-64 flex items-center justify-center bg-gray-200 rounded-lg shadow-md sm:w-80 sm:h-80">
                <span class="text-gray-500">ไม่มีรูปภาพ</span>
              </div>
            }
          </div>
          <div class="w-full mb-8">
            <div class="text-center text-[#9D1616] mb-2">เวลาเหลือ: {{ timeLeft }} วินาที</div>
            <div class="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="absolute top-0 h-full bg-[#9D1616] transition-all duration-1000"
                [style.width.%]="(timeLeft / 30) * 100"
              ></div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 w-full mb-8">
            <button
              *ngFor="let choice of currentQuestion.options; let i = index"
              (click)="selectAnswer(i)"
              class="py-3 px-4 bg-[#9D1616] text-white rounded-lg shadow-md hover:bg-[#7B1111] transition duration-200 text-base font-medium"
            >
              {{ choice }}
            </button>
          </div>
        </div>
      }
      @if (showGameOverPopup && !(isLoading$ | async)) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div class="bg-white rounded-lg p-6 w-11/12 max-w-md sm:max-w-lg">
            <h2 class="text-lg font-semibold text-[#9D1616] mb-4">Game Over</h2>
            <p class="text-gray-700 mb-6">หมดเวลา! ต้องการเล่นใหม่หรือไม่?</p>
            <div class="flex justify-end space-x-2">
              <button
                (click)="restartGame()"
                class="px-4 py-2 bg-[#9D1616] text-white rounded-lg hover:bg-[#7B1111]"
              >
                เล่นใหม่
              </button>
              <button
                (click)="returnToPuzzle()"
                class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                กลับสู่หน้าเกม
              </button>
            </div>
          </div>
        </div>
      }
      @if (showSuccessPopup && !(isLoading$ | async)) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div class="bg-white rounded-lg p-6 w-11/12 max-w-md sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 class="text-lg font-semibold text-[#9D1616] mb-4">สำเร็จ!</h2>
            <p class="text-gray-700 mb-6">คุณทำแบบทดสอบครบ {{ questions.length }} ข้อเรียบร้อยแล้ว! คะแนน: {{ score }} / {{ questions.length }}</p>
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-[#9D1616] mb-2">เฉลย</h3>
              <div *ngFor="let answer of answers; let i = index" class="mb-4">
                <p class="text-gray-700 mb-1">คำถาม {{ i + 1 }}: {{ answer.question.text }}</p>
                <p class="mb-1">
                  คุณเลือก: 
                  <span [ngClass]="{'text-green-600': answer.isCorrect, 'text-red-600': !answer.isCorrect}">
                    {{ answer.selectedAnswer }}
                  </span>
                </p>
                <p class="text-gray-700">คำตอบที่ถูกต้อง: {{ answer.question.options[answer.question.answerIndex] }}</p>
              </div>
            </div>
            <div class="flex justify-end space-x-2">
              <button
                (click)="restartGame()"
                class="px-4 py-2 bg-[#9D1616] text-white rounded-lg hover:bg-[#7B1111]"
              >
                ทำแบบทดสอบใหม่
              </button>
              <button
                (click)="returnToPuzzle()"
                class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                กลับสู่หน้าเกม
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .animate-spin {
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
  ]
})
export class GuessWordGameComponent implements OnInit, OnDestroy {
  showStartPopup: boolean = true;
  showCountdown: boolean = false;
  showGameOverPopup: boolean = false;
  showSuccessPopup: boolean = false;
  countdown: number = 3;
  timeLeft: number = 30;
  currentQuestionIndex: number = 0;
  currentQuestion: Question = { questionId: '', text: '', options: [], answerIndex: 0, image: '' };
  questions: Question[] = [];
  answers: Answer[] = [];
  score: number = 0;
  isLoading$!: Observable<boolean>;
  user: { token: string } | null = null;

  private timerSubscription: Subscription | null = null;
  private countdownSubscription: Subscription | null = null;
  private readonly quizApiUrl = `${environment.apiUrl}/quizzes/random/game`;
  private readonly imageApiUrl = `${environment.apiUrl}/quiz-images/by-question`;
  private readonly quizHistoryApiUrl = `${environment.apiUrl}/quiz-history`;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private http: HttpClient,
    private spinnerService: SpinnerService,
    private authService: AuthService
  ) {
    this.isLoading$ = this.spinnerService.isLoading$;
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    this.loadQuestions();
  }

  ngOnDestroy(): void {
    this.stopTimers();
  }

  loadQuestions(): void {
    this.spinnerService.show();
    this.http.get<QuizResponse>(this.quizApiUrl).subscribe({
      next: (response: QuizResponse) => {
        this.questions = response.items.map(item => ({
          questionId: item.questionId,
          text: item.text,
          options: item.options,
          answerIndex: item.answerIndex,
          image: ''
        }));
        if (this.questions.length > 0) {
          this.currentQuestion = this.questions[0];
          this.loadImageForQuestion(0);
        } else {
          console.error('No questions received from API');
          this.spinnerService.hide();
          this.cdr.markForCheck();
        }
      },
      error: (error) => {
        console.error('Error fetching questions:', error);
        this.spinnerService.hide();
        this.cdr.markForCheck();
      }
    });
  }

  loadImageForQuestion(index: number): void {
    const question = this.questions[index];
    if (!question.questionId) {
      console.warn('Question ID is missing:', question);
      question.image = '';
      if (index === this.currentQuestionIndex) {
        this.currentQuestion = question;
      }
      this.spinnerService.hide();
      this.cdr.markForCheck();
      return;
    }

    const imageUrl = `${this.imageApiUrl}/${question.questionId}`;
    this.http.get<QuizImageResponse>(imageUrl).subscribe({
      next: (response) => {
        if (response.base64Data && response.contentType) {
          try {
            let base64Data = response.base64Data;
            const prefixes = ['data:image/png;base64:', 'data:image/png;base64,'];
            for (const prefix of prefixes) {
              while (base64Data.startsWith(prefix)) {
                base64Data = base64Data.replace(prefix, '');
              }
            }
            const isValidBase64 = /^[A-Za-z0-9+/=]+$/.test(base64Data);
            if (!isValidBase64) {
              throw new Error('Invalid base64 data');
            }
            question.image = `data:${response.contentType};base64,${base64Data}`;
          } catch (error) {
            console.error(`Invalid base64 data for question ${question.questionId}:`, error);
            question.image = '';
          }
        } else {
          console.warn(`No base64Data or contentType for question ${question.questionId}`);
          question.image = '';
        }
        if (index === this.currentQuestionIndex) {
          this.currentQuestion = question;
        }
        this.spinnerService.hide();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error(`Error fetching image for question ${question.questionId}:`, error);
        question.image = '';
        if (index === this.currentQuestionIndex) {
          this.currentQuestion = question;
        }
        this.spinnerService.hide();
        this.cdr.markForCheck();
      }
    });
  }

  handleImageError(event: Event): void {
    console.warn('Image failed to load:', event);
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
  }

  startGame(): void {
    this.showStartPopup = false;
    this.showCountdown = true;
    this.countdown = 3;
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.showCountdown = false;
        this.countdownSubscription?.unsubscribe();
        this.startQuizTimer();
      }
      this.cdr.markForCheck();
    });
  }

  startQuizTimer(): void {
    this.stopTimers();
    this.timeLeft = 30;
    this.timerSubscription = interval(1000).subscribe(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.showGameOverPopup = true;
        this.timerSubscription?.unsubscribe();
      }
      this.cdr.markForCheck();
    });
  }

  selectAnswer(index: number): void {
    const isCorrect = index === this.currentQuestion.answerIndex;
    if (isCorrect) {
      this.score++;
    }
    this.answers.push({
      question: { ...this.currentQuestion },
      selectedAnswer: this.currentQuestion.options[index],
      isCorrect
    });
    this.nextQuestion();
  }

  nextQuestion(): void {
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.questions.length) {
      this.spinnerService.show();
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.loadImageForQuestion(this.currentQuestionIndex);
      this.startQuizTimer();
    } else {
      this.showSuccessPopup = true;
      this.stopTimers();
      this.saveScore();
      this.cdr.markForCheck();
    }
  }

  saveScore(): void {
    if (this.user?.token) {
      this.spinnerService.show();
      const payload = {
        mode: 'game',
        score: this.score
      };
      this.http
        .post(this.quizHistoryApiUrl, payload, {
          headers: { Authorization: `Bearer ${this.user.token}` }
        })
        .subscribe({
          next: () => {
            console.log('Score saved successfully');
            this.spinnerService.hide();
            this.cdr.markForCheck();
          },
          error: (error) => {
            console.error('Error saving score:', error);
            this.spinnerService.hide();
            this.cdr.markForCheck();
          }
        });
    } else {
      console.log('No user logged in, score not saved');
    }
  }

  restartGame(): void {
    this.currentQuestionIndex = 0;
    this.answers = [];
    this.score = 0;
    this.showGameOverPopup = false;
    this.showSuccessPopup = false;
    this.showStartPopup = true;
    this.stopTimers();
    this.loadQuestions();
  }

  returnToPuzzle(): void {
    this.stopTimers();
    this.router.navigateByUrl('/puzzle');
  }

  private stopTimers(): void {
    this.timerSubscription?.unsubscribe();
    this.countdownSubscription?.unsubscribe();
    this.timerSubscription = null;
    this.countdownSubscription = null;
  }
}
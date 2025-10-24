import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../env';

interface Question {
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
      @if (showStartPopup) {
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
      @if (showCountdown) {
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
      @if (!showStartPopup && !showCountdown && !showSuccessPopup) {
        <div class="flex flex-col items-center w-full max-w-md sm:max-w-lg">
          <div class="text-center text-xl text-[#9D1616] mb-4">
            คำถามที่ {{ currentQuestionIndex + 1 }} / {{ questions.length }}
          </div>
          <div class="mb-4">
            <img
              [src]="currentQuestion.image"
              alt="Guess the Word Image"
              class="w-64 h-64 object-cover rounded-lg shadow-md sm:w-80 sm:h-80"
            />
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
      @if (showGameOverPopup) {
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
      @if (showSuccessPopup) {
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
  styles: []
})
export class GuessWordGameComponent implements OnInit, OnDestroy {
  showStartPopup: boolean = true;
  showCountdown: boolean = false;
  showGameOverPopup: boolean = false;
  showSuccessPopup: boolean = false;
  countdown: number = 3;
  timeLeft: number = 30;
  currentQuestionIndex: number = 0;
  currentQuestion: Question;
  questions: Question[] = [];
  answers: Answer[] = [];
  score: number = 0;
  private timerSubscription: Subscription | null = null;
  private countdownSubscription: Subscription | null = null;

  constructor(private cdr: ChangeDetectorRef, private router: Router, private http: HttpClient) {
    this.currentQuestion = { text: '', options: [], answerIndex: 0, image: '' };
  }

  ngOnInit() {
    this.http.get(`${environment.apiUrl}/quizzes`).subscribe({
      next: (response: any) => {
        console.log('Quizzes fetched:', response);
        const allQuestions = response.flatMap((quiz: any) => quiz.questions);
        this.questions = allQuestions.map((q: any) => ({
          text: q.text,
          options: q.options,
          answerIndex: q.answerIndex,
          image: `https://via.placeholder.com/300?text=${encodeURIComponent(q.options[q.answerIndex])}`
        }));
        this.currentQuestion = this.questions[0];
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching quizzes:', error);
      }
    });
  }

  ngOnDestroy() {
    this.stopTimers();
  }

  startGame() {
    this.showStartPopup = false;
    this.showCountdown = true;
    this.countdown = 3;
    this.countdownSubscription = interval(1000).subscribe(() => {
      if (this.countdown > 0) {
        this.countdown--;
        this.cdr.markForCheck();
      } else {
        this.showCountdown = false;
        this.countdownSubscription?.unsubscribe();
        this.startQuizTimer();
        this.cdr.markForCheck();
      }
    });
  }

  startQuizTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timeLeft = 30;
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.cdr.markForCheck();
      } else {
        this.showGameOverPopup = true;
        this.timerSubscription?.unsubscribe();
        this.cdr.markForCheck();
      }
    });
  }

  selectAnswer(index: number) {
    const isCorrect = index === this.currentQuestion.answerIndex;
    if (isCorrect) {
      this.score++;
    }
    this.answers.push({
      question: this.currentQuestion,
      selectedAnswer: this.currentQuestion.options[index],
      isCorrect
    });
    this.nextQuestion();
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.startQuizTimer();
    } else {
      this.showSuccessPopup = true;
      this.timerSubscription?.unsubscribe();
    }
    this.cdr.markForCheck();
  }

  restartGame() {
    this.currentQuestionIndex = 0;
    this.currentQuestion = this.questions[0];
    this.showGameOverPopup = false;
    this.showSuccessPopup = false;
    this.answers = [];
    this.score = 0;
    this.showStartPopup = true;
    this.stopTimers();
    this.cdr.markForCheck();
  }

  returnToPuzzle() {
    this.stopTimers();
    this.router.navigateByUrl('/puzzle');
  }

  private stopTimers() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }
}
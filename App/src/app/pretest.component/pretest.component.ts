import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../env';
import { SpinnerService } from '../../spinner.service';
import { AuthService } from '../../auth.service';
import { Observable } from 'rxjs';

interface Question {
  type: string;
  category: string;
  quizId: string;
  questionId: string;
  text: string;
  options: string[];
  answerIndex: number;
}

interface Answer {
  question: Question;
  selectedAnswer: string;
  isCorrect: boolean;
}

@Component({
  selector: 'app-pretest',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative flex flex-col items-center min-h-[calc(100vh-8rem)] bg-gray-100 p-4">
      <button
        (click)="returnToMain()"
        class="absolute top-4 left-4 p-2 rounded-full bg-[#9D1616] text-white hover:bg-[#7B1111] transition duration-200 z-30"
        title="กลับสู่หน้าเลือกโหมด"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      @if (isLoading$ | async) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div class="w-16 h-16 border-4 border-[#9D1616] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
      @if (!showResults && questions.length > 0 && !(isLoading$ | async)) {
        <div class="flex flex-col items-center w-full max-w-md sm:max-w-lg overflow-y-auto pb-20">
          <h2 class="text-2xl font-bold text-[#9D1616] mb-6">แบบทดสอบก่อนเรียน</h2>
          @for (question of questions; track question.questionId; let index = $index) {
            <div
              #questionElements
              class="w-full mb-8"
              [ngClass]="{'border-l-4 border-red-600': !answers[index].selectedAnswer && showUnanswered}"
            >
              <p class="text-lg font-semibold text-gray-700 mb-4">คำถาม {{ index + 1 }}: {{ question.text }}</p>
              <div class="space-y-2">
                @for (option of question.options; track option; let optionIndex = $index) {
                  <label class="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-[#FFF5F5] cursor-pointer">
                    <input
                      type="radio"
                      [name]="'question-' + index"
                      [value]="option"
                      [(ngModel)]="answers[index].selectedAnswer"
                      (change)="onAnswerChange()"
                      class="mr-2 accent-[#9D1616]"
                    />
                    <span class="text-gray-700">{{ option }}</span>
                  </label>
                }
              </div>
            </div>
          }
          <button
            (click)="submitAnswers()"
            class="px-6 py-3 bg-[#9D1616] text-white rounded-lg hover:bg-[#7B1111] transition duration-200 mt-4"
          >
            ส่งคำตอบ
          </button>
        </div>
      }
      @if (!showResults && questions.length === 0 && !(isLoading$ | async)) {
        <div class="flex flex-col items-center w-full max-w-md sm:max-w-lg">
          <h2 class="text-2xl font-bold text-[#9D1616] mb-6">แบบทดสอบก่อนเรียน</h2>
          <p class="text-gray-700 mb-4">ไม่สามารถโหลดคำถามได้ กรุณาลองอีกครั้ง</p>
          <button
            (click)="returnToMain()"
            class="px-4 py-2 bg-[#9D1616] text-white rounded-lg hover:bg-[#7B1111]"
          >
            กลับสู่หน้าเลือกโหมด
          </button>
        </div>
      }
      @if (showResults) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div class="bg-white rounded-lg p-6 w-11/12 max-w-md sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 class="text-lg font-semibold text-[#9D1616] mb-4">ผลลัพธ์แบบทดสอบ</h2>
            <p class="text-gray-700 mb-6">คุณทำแบบทดสอบครบ {{ questions.length }} ข้อเรียบร้อยแล้ว! คะแนน: {{ score }} / {{ questions.length }}</p>
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-[#9D1616] mb-2">เฉลย</h3>
              @for (answer of answers; track answer.question.questionId; let index = $index) {
                <div class="mb-4">
                  <p class="text-gray-700 mb-1">คำถาม {{ index + 1 }}: {{ answer.question.text }}</p>
                  <p class="mb-1">
                    คุณเลือก: 
                    <span [ngClass]="{'text-green-600': answer.isCorrect, 'text-red-600': !answer.isCorrect}">
                      {{ answer.selectedAnswer || 'ไม่ได้เลือก' }}
                    </span>
                  </p>
                  <p class="text-gray-700">คำตอบที่ถูกต้อง: {{ answer.question.options[answer.question.answerIndex] }}</p>
                </div>
              }
            </div>
            <div class="flex justify-end space-x-2">
              <button
                (click)="restartTest()"
                class="px-4 py-2 bg-[#9D1616] text-white rounded-lg hover:bg-[#7B1111]"
              >
                ทำแบบทดสอบใหม่
              </button>
              <button
                (click)="returnToMain()"
                class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                กลับสู่หน้าเลือกโหมด
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class PretestComponent implements OnInit {
  questions: Question[] = [];
  answers: Answer[] = [];
  score: number = 0;
  showResults: boolean = false;
  showUnanswered: boolean = false;
  isLoading$: Observable<boolean> = new Observable();
  @ViewChildren('questionElements') questionElements!: QueryList<ElementRef>;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private http: HttpClient,
    private spinnerService: SpinnerService,
    private authService: AuthService
  ) {
    this.isLoading$ = this.spinnerService.isLoading$;
  }

  ngOnInit() {
    this.spinnerService.show();
    this.http.get(`${environment.apiUrl}/quizzes/random/pretest`).subscribe({
      next: (response: any) => {
        this.questions = Array.isArray(response.items) ? response.items : [];
        this.answers = this.questions.map(q => ({
          question: q,
          selectedAnswer: '',
          isCorrect: false
        }));
        this.spinnerService.hide();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching quizzes:', error);
        this.questions = [];
        this.answers = [];
        this.spinnerService.hide();
        this.cdr.markForCheck();
      }
    });
  }

  onAnswerChange() {
    this.showUnanswered = false;
    this.cdr.markForCheck();
  }

  allQuestionsAnswered(): boolean {
    return this.answers.every(answer => answer.selectedAnswer !== '');
  }

  submitAnswers() {
    if (!this.allQuestionsAnswered()) {
      this.showUnanswered = true;
      this.cdr.markForCheck();
      const firstUnansweredIndex = this.answers.findIndex(answer => answer.selectedAnswer === '');
      if (firstUnansweredIndex !== -1 && this.questionElements) {
        const element = this.questionElements.toArray()[firstUnansweredIndex]?.nativeElement;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      return;
    }

    this.spinnerService.show();
    setTimeout(() => {
      this.score = 0;
      this.answers.forEach(answer => {
        answer.isCorrect = answer.selectedAnswer === answer.question.options[answer.question.answerIndex];
        if (answer.isCorrect) {
          this.score++;
        }
      });
      const user = this.authService.getUser();
      if (user && user.token) {
        this.http.post(`${environment.apiUrl}/quiz-history`, {
          mode: 'pretest',
          score: this.score
        }, {
          headers: { Authorization: `Bearer ${user.token}` }
        }).subscribe({
          next: () => console.log('Quiz history saved'),
          error: (error) => console.error('Error saving quiz history:', error)
        });
      }
      this.showResults = true;
      this.spinnerService.hide();
      this.cdr.markForCheck();
    }, 500);
  }

  restartTest() {
    this.score = 0;
    this.showResults = false;
    this.showUnanswered = false;
    this.answers = this.questions.map(q => ({
      question: q,
      selectedAnswer: '',
      isCorrect: false
    }));
    this.cdr.markForCheck();
  }

  returnToMain() {
    this.router.navigateByUrl('/home');
  }
}
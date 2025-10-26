import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth.service';
import { FontSizeService } from '../../font-size.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../env';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerService } from '../../spinner.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface QuizHistory {
  _id: string;
  userId: string;
  mode: string;
  score: number;
  playedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface NewQuestion {
  type: string;
  category: string;
  text: string;
  options: string[];
  answerIndex: number;
  base64Data: string;
  mimeType: string;
  caption: string;
}

interface Vocabulary {
  _id: string;
  chWord: string;
  pinYin: string;
  thWord: string;
  image: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bg-white p-4 shadow-md fixed bottom-0 w-full">
      <div class="flex flex-row justify-around items-center mx-auto max-w-screen-lg">
        <button
          routerLink="/home"
          routerLinkActive="active"
          (click)="closeDropdown()"
          class="p-2 text-[#9D1616] hover:text-[#7B1111] transition duration-200"
          title="หน้าหลัก"
        >
          <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
        </button>
        <button
          routerLink="/puzzle"
          routerLinkActive="active"
          (click)="closeDropdown()"
          class="p-2 text-[#9D1616] hover:text-[#7B1111] transition duration-200"
          title="จิ๊กซอ"
        >
          <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </button>
        <button
          routerLink="/book"
          routerLinkActive="active"
          (click)="closeDropdown()"
          class="p-2 text-[#9D1616] hover:text-[#7B1111] transition duration-200"
          title="สมุดโน้ต"
        >
          <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </button>
        <div class="relative">
          <button
            (click)="toggleDropdown()"
            class="p-2 text-[#9D1616] hover:text-[#7B1111] transition duration-200"
            title="การตั้งค่า"
          >
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1 .608 1.906.07 2.573-1.066z"></path>
            </svg>
          </button>
          @if (showDropdown) {
            <div class="absolute bottom-full right-0 mb-2 w-60 bg-white shadow-md rounded-lg p-2 sm:w-72">
              <button
                (click)="toggleSettingsPopup()"
                class="w-full flex items-center space-x-2 px-4 py-2 text-[#9D1616] hover:bg-[#9D1616] hover:text-white rounded-lg transition duration-200"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1 .608 1.906.07 2.573-1.066z"></path>
                </svg>
                <span>ตั้งค่าระบบ</span>
              </button>
              @if (user?.token) {
                <button
                  (click)="toggleUserSettingsPopup()"
                  class="w-full flex items-center space-x-2 px-4 py-2 text-[#9D1616] hover:bg-[#9D1616] hover:text-white rounded-lg transition duration-200"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>ตั้งค่าผู้ใช้</span>
                </button>
                <button
                  (click)="toggleQuizHistoryPopup()"
                  class="w-full flex items-center space-x-2 px-4 py-2 text-[#9D1616] hover:bg-[#9D1616] hover:text-white rounded-lg transition duration-200"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>ประวัติผู้ใช้งาน</span>
                </button>
              }
              <button
                (click)="toggleFontSizePopup()"
                class="w-full flex items-center space-x-2 px-4 py-2 text-[#9D1616] hover:bg-[#9D1616] hover:text-white rounded-lg transition duration-200"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>ตั้งค่าตัวอักษร</span>
              </button>
              @if (user?.token) {
                <button
                  (click)="logout()"
                  class="w-full flex items-center space-x-2 px-4 py-2 text-[#9D1616] hover:bg-[#9D1616] hover:text-white rounded-lg transition duration-200"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  <span>ออกจากระบบ</span>
                </button>
              } @else {
                <button
                  routerLink=""
                  (click)="closeDropdown()"
                  class="w-full flex items-center space-x-2 px-4 py-2 text-[#9D1616] hover:bg-[#9D1616] hover:text-white rounded-lg transition duration-200"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  <span>ไปหน้าหลัก</span>
                </button>
              }
            </div>
          }
        </div>
      </div>
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
      @if (showSettingsPopup) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-11/12 max-w-md sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 class="text-lg font-semibold text-[#9D1616] mb-4">ตั้งค่าระบบ</h2>
            <div class="grid grid-cols-2 gap-4 mb-6">
              <button
                (click)="openAddQuestion()"
                class="py-3 px-4 bg-[#9D1616] text-white rounded-lg hover:bg-[#7B1111]"
              >
                เพิ่มคำถาม
              </button>
              <button
                (click)="openDeleteQuestion()"
                class="py-3 px-4 bg-[#9D1616] text-white rounded-lg hover:bg-[#7B1111]"
              >
                ลบคำถาม
              </button>
              <button
                (click)="openAddVocabulary()"
                class="py-3 px-4 bg-[#9D1616] text-white rounded-lg hover:bg-[#7B1111]"
              >
                เพิ่มคำศัพท์
              </button>
              <button
                (click)="openManageVocabulary()"
                class="py-3 px-4 bg-[#9D1616] text-white rounded-lg hover:bg-[#7B1111]"
              >
                จัดการคำศัพท์
              </button>
            </div>
            <div class="flex justify-end">
              <button
                (click)="closeSettingsPopup()"
                class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      }
      @if (showAddQuestionPopup) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-11/12 max-w-md sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 class="text-lg font-semibold text-[#9D1616] mb-4">เพิ่มคำถาม</h2>
            <form [formGroup]="questionForm" (ngSubmit)="submitQuestions()">
              <div class="mb-4 p-4 border border-gray-300 rounded-lg">
                <div class="mb-4">
                  <label class="block text-gray-700">หมวดหมู่</label>
                  <select
                    formControlName="category"
                    class="w-full p-2 border rounded-lg"
                  >
                    <option value="" disabled>เลือกหมวดหมู่</option>
                    <option value="ตัวเลข ลำดับ">ตัวเลข ลำดับ</option>
                    <option value="เกี่ยวกับฉัน">เกี่ยวกับฉัน</option>
                    <option value="สวัสดีทักท้าย">สวัสดีทักท้าย</option>
                    <option value="อาหาร">อาหาร</option>
                    <option value="ท้องถนน">ท้องถนน</option>
                    <option value="ฤดูกาล">ฤดูกาล</option>
                    <option value="ครอบครัว">ครอบครัว</option>
                  </select>
                  @if (questionForm.get('category')?.errors?.['required'] && questionForm.get('category')?.touched) {
                    <p class="text-red-600 text-sm mt-1">กรุณาเลือกหมวดหมู่</p>
                  }
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700">คำถาม</label>
                  <input
                    formControlName="text"
                    type="text"
                    class="w-full p-2 border rounded-lg"
                    placeholder="เช่น น้ำชาในภาษาจีนว่าอะไร?"
                  />
                  @if (questionForm.get('text')?.errors?.['required'] && questionForm.get('text')?.touched) {
                    <p class="text-red-600 text-sm mt-1">กรุณากรอกคำถาม</p>
                  }
                </div>
                <div class="mb-4" formArrayName="options">
                  <label class="block text-gray-700">ตัวเลือก (4 ตัวเลือก)</label>
                  @for (option of optionsFormArray.controls; let j = $index; track j) {
                    <div class="mb-2">
                      <input
                        [formControlName]="j"
                        type="text"
                        class="w-full p-2 border rounded-lg"
                        placeholder="ตัวเลือก {{ j + 1 }}"
                      />
                      @if (option.errors?.['required'] && option.touched) {
                        <p class="text-red-600 text-sm mt-1">กรุณากรอกตัวเลือก {{ j + 1 }}</p>
                      }
                    </div>
                  }
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700">เฉลยคำตอบ (ข้อ 1-4)</label>
                  <input
                    formControlName="answerIndex"
                    type="number"
                    min="1"
                    max="4"
                    class="w-full p-2 border rounded-lg"
                    placeholder="เช่น 1"
                  />
                  @if (questionForm.get('answerIndex')?.errors?.['required'] && questionForm.get('answerIndex')?.touched) {
                    <p class="text-red-600 text-sm mt-1">กรุณากรอกเฉลยคำตอบ</p>
                  }
                  @if (questionForm.get('answerIndex')?.errors?.['min'] || questionForm.get('answerIndex')?.errors?.['max']) {
                    <p class="text-red-600 text-sm mt-1">เฉลยคำตอบต้องอยู่ระหว่าง 1 ถึง 4</p>
                  }
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700">ภาพ</label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    (change)="onFileChange($event)"
                    class="w-full p-2 border rounded-lg"
                  />
                  @if (questionForm.get('base64Data')?.errors?.['required'] && questionForm.get('base64Data')?.touched) {
                    <p class="text-red-600 text-sm mt-1">กรุณาอัปโหลดภาพ</p>
                  }
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700">คำอธิบายภาพ</label>
                  <input
                    formControlName="caption"
                    type="text"
                    class="w-full p-2 border rounded-lg"
                    placeholder="เช่น ภาพน้ำชา"
                  />
                  @if (questionForm.get('caption')?.errors?.['required'] && questionForm.get('caption')?.touched) {
                    <p class="text-red-600 text-sm mt-1">กรุณากรอกคำอธิบายภาพ</p>
                  }
                </div>
              </div>
              <div class="flex justify-end space-x-2">
                <button
                  type="submit"
                  class="px-4 py-2 bg-[#9D1616] text-white rounded-lg hover:bg-[#7B1111]"
                >
                  ส่ง
                </button>
                <button
                  type="button"
                  (click)="closeAddQuestionPopup()"
                  class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  ปิด
                </button>
              </div>
            </form>
          </div>
        </div>
      }
      @if (showAddVocabularyPopup) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-11/12 max-w-md sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 class="text-lg font-semibold text-[#9D1616] mb-4">เพิ่มคำศัพท์</h2>
            <form [formGroup]="vocabularyForm" (ngSubmit)="submitVocabulary()">
              <div class="mb-4">
                <label class="block text-gray-700">คำศัพท์ภาษจีน</label>
                <input
                  formControlName="chWord"
                  type="text"
                  class="w-full p-2 border rounded-lg"
                  placeholder="เช่น 你好"
                />
                @if (vocabularyForm.get('chWord')?.errors?.['required'] && vocabularyForm.get('chWord')?.touched) {
                  <p class="text-red-600 text-sm mt-1">กรุณากรอกคำศัพท์ภาษจีน</p>
                }
              </div>
              <div class="mb-4">
                <label class="block text-gray-700">พินอิน</label>
                <input
                  formControlName="pinYin"
                  type="text"
                  class="w-full p-2 border rounded-lg"
                  placeholder="เช่น nǐ hǎo"
                />
                @if (vocabularyForm.get('pinYin')?.errors?.['required'] && vocabularyForm.get('pinYin')?.touched) {
                  <p class="text-red-600 text-sm mt-1">กรุณากรอกพินอิน</p>
                }
              </div>
              <div class="mb-4">
                <label class="block text-gray-700">คำแปลภาษาไทย</label>
                <input
                  formControlName="thWord"
                  type="text"
                  class="w-full p-2 border rounded-lg"
                  placeholder="เช่น สวัสดี"
                />
                @if (vocabularyForm.get('thWord')?.errors?.['required'] && vocabularyForm.get('thWord')?.touched) {
                  <p class="text-red-600 text-sm mt-1">กรุณากรอกคำแปลภาษาไทย</p>
                }
              </div>
              <div class="mb-4">
                <label class="block text-gray-700">ภาพ</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  (change)="onVocabularyFileChange($event)"
                  class="w-full p-2 border rounded-lg"
                />
                @if (vocabularyForm.get('image')?.errors?.['required'] && vocabularyForm.get('image')?.touched) {
                  <p class="text-red-600 text-sm mt-1">กรุณาอัปโหลดภาพ</p>
                }
              </div>
              <div class="flex justify-end space-x-2">
                <button
                  type="submit"
                  class="px-4 py-2 bg-[#9D1616] text-white rounded-lg hover:bg-[#7B1111]"
                >
                  ส่ง
                </button>
                <button
                  type="button"
                  (click)="closeAddVocabularyPopup()"
                  class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  ปิด
                </button>
              </div>
            </form>
          </div>
        </div>
      }
      @if (showManageVocabularyPopup) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-11/12 max-w-md sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 class="text-lg font-semibold text-[#9D1616] mb-4">จัดการคำศัพท์</h2>
            @if (vocabularies.length > 0) {
              <div class="overflow-x-auto">
                <table class="min-w-[600px] table-auto border-collapse">
                  <thead>
                    <tr class="bg-[#9D1616] text-white">
                      <th class="px-4 py-2 text-left">คำศัพท์ภาษจีน</th>
                      <th class="px-4 py-2 text-left">พินอิน</th>
                      <th class="px-4 py-2 text-left">คำแปลภาษาไทย</th>
                      <th class="px-4 py-2 text-left">การกระทำ</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (vocab of vocabularies; track vocab._id) {
                      <tr class="border-b border-gray-200">
                        <td class="px-4 py-2 text-gray-700">{{ vocab.chWord }}</td>
                        <td class="px-4 py-2 text-gray-700">{{ vocab.pinYin }}</td>
                        <td class="px-4 py-2 text-gray-700">{{ vocab.thWord }}</td>
                        <td class="px-4 py-2 text-gray-700">
                          <button
                            (click)="editVocabulary(vocab)"
                            class="px-2 py-1 bg-[#9D1616] text-white rounded-lg hover:bg-[#7B1111] mr-2"
                          >
                            แก้ไข
                          </button>
                          <button
                            (click)="deleteVocabulary(vocab._id)"
                            class="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            ลบ
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <p class="text-gray-700 mb-4">ไม่มีคำศัพท์</p>
            }
            <div class="flex justify-end mt-4">
              <button
                (click)="closeManageVocabularyPopup()"
                class="px-4 py-2 bg-[#9D1616] text-white rounded-lg hover:bg-[#7B1111]"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      }
      @if (showEditVocabularyPopup) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-11/12 max-w-md sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 class="text-lg font-semibold text-[#9D1616] mb-4">แก้ไขคำศัพท์</h2>
            <form [formGroup]="vocabularyForm" (ngSubmit)="submitEditVocabulary()">
              <div class="mb-4">
                <label class="block text-gray-700">คำศัพท์ภาษจีน</label>
                <input
                  formControlName="chWord"
                  type="text"
                  class="w-full p-2 border rounded-lg"
                  placeholder="เช่น 你好"
                />
                @if (vocabularyForm.get('chWord')?.errors?.['required'] && vocabularyForm.get('chWord')?.touched) {
                  <p class="text-red-600 text-sm mt-1">กรุณากรอกคำศัพท์ภาษจีน</p>
                }
              </div>
              <div class="mb-4">
                <label class="block text-gray-700">พินอิน</label>
                <input
                  formControlName="pinYin"
                  type="text"
                  class="w-full p-2 border rounded-lg"
                  placeholder="เช่น nǐ hǎo"
                />
                @if (vocabularyForm.get('pinYin')?.errors?.['required'] && vocabularyForm.get('pinYin')?.touched) {
                  <p class="text-red-600 text-sm mt-1">กรุณากรอกพินอิน</p>
                }
              </div>
              <div class="mb-4">
                <label class="block text-gray-700">คำแปลภาษาไทย</label>
                <input
                  formControlName="thWord"
                  type="text"
                  class="w-full p-2 border rounded-lg"
                  placeholder="เช่น สวัสดี"
                />
                @if (vocabularyForm.get('thWord')?.errors?.['required'] && vocabularyForm.get('thWord')?.touched) {
                  <p class="text-red-600 text-sm mt-1">กรุณากรอกคำแปลภาษาไทย</p>
                }
              </div>
              <div class="mb-4">
                <label class="block text-gray-700">ภาพ</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  (change)="onVocabularyFileChange($event)"
                  class="w-full p-2 border rounded-lg"
                />
                @if (vocabularyForm.get('image')?.errors?.['required'] && vocabularyForm.get('image')?.touched) {
                  <p class="text-red-600 text-sm mt-1">กรุณาอัปโหลดภาพ</p>
                }
              </div>
              <div class="flex justify-end space-x-2">
                <button
                  type="submit"
                  class="px-4 py-2 bg-[#9D1616] text-white rounded-lg hover:bg-[#7B1111]"
                >
                  ส่ง
                </button>
                <button
                  type="button"
                  (click)="closeEditVocabularyPopup()"
                  class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  ปิด
                </button>
              </div>
            </form>
          </div>
        </div>
      }
      @if (showUserSettingsPopup && user?.token) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-11/12 max-w-md sm:max-w-lg">
            <h2 class="text-lg font-semibold text-[#9D1616] mb-4">ตั้งค่าผู้ใช้</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-[#9D1616]">ชื่อ</label>
                <input
                  type="text"
                  [value]="user?.name || ''"
                  disabled
                  class="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-[#D9D9D9] text-gray-700"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-[#9D1616]">อีเมล</label>
                <input
                  type="email"
                  [value]="user?.email || ''"
                  disabled
                  class="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-[#D9D9D9] text-gray-700"
                />
              </div>
            </div>
            <div class="flex justify-end mt-6 space-x-2">
              <button
                disabled
                class="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                title="รอ API สำหรับแก้ไขข้อมูล"
              >
                แก้ไข
              </button>
              <button
                (click)="toggleUserSettingsPopup()"
                class="px-4 py-2 bg-[#9D1616] text-white rounded-lg hover:bg-[#7B1111]"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      }
      @if (showQuizHistoryPopup && user?.token) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-11/12 max-w-md sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 class="text-lg font-semibold text-[#9D1616] mb-4">ประวัติคะแนนแบบทดสอบ</h2>
            @if (isQuizHistoryLoaded) {
              @if (quizHistory.length > 0) {
                <div class="overflow-x-auto">
                  <table class="min-w-[600px] table-auto border-collapse">
                    <thead>
                      <tr class="bg-[#9D1616] text-white">
                        <th class="px-4 py-2 text-left w-1/3 min-w-[200px]">โหมด</th>
                        <th class="px-4 py-2 text-left w-1/6 min-w-[100px]">คะแนน</th>
                        <th class="px-4 py-2 text-left w-1/2 min-w-[300px]">วันที่เล่น</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (entry of quizHistory; track entry._id) {
                        <tr class="border-b border-gray-200">
                          <td class="px-4 py-2 text-gray-700">{{ entry.mode === 'pretest' ? 'แบบทดสอบก่อนเรียน' : 'เกม' }}</td>
                          <td class="px-4 py-2 text-gray-700">{{ entry.score }}</td>
                          <td class="px-4 py-2 text-gray-700">{{ formatDate(entry.playedAt) }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              } @else {
                <p class="text-gray-700 mb-4">ไม่มีประวัติคะแนน</p>
              }
            } @else {
              <p class="text-gray-700 mb-4">กำลังโหลดประวัติคะแนน...</p>
            }
            <div class="flex justify-end mt-4">
              <button
                (click)="toggleQuizHistoryPopup()"
                class="px-4 py-2 bg-[#9D1616] text-white rounded-lg hover:bg-[#7B1111]"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      }
      @if (showFontSizePopup) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-11/12 max-w-md sm:max-w-lg">
            <h2 class="text-lg font-semibold text-[#9D1616] mb-4">ปรับขนาดตัวอักษร</h2>
            <div class="relative w-full h-12 bg-gray-200 rounded-full overflow-hidden" #slider>
              <div
                class="absolute top-0 h-full bg-[#9D1616] transition-all duration-100"
                [style.width.%]="sliderPosition"
              ></div>
              <div
                class="absolute top-0 h-full w-6 bg-[#7B1111] rounded-full cursor-pointer"
                [style.left.%]="sliderPosition"
                [style.transform]="'translateX(-50%)'"
                (mousedown)="startDragging($event)"
                (touchstart)="startDragging($event)"
              ></div>
            </div>
            <div class="flex justify-between mt-2 text-[#9D1616]">
              <span>0%</span>
              <span>{{ getRoundedPercentage() }}%</span>
              <span>100%</span>
            </div>
            <div class="flex justify-end mt-4">
              <button
                (click)="toggleFontSizePopup()"
                class="px-4 py-2 bg-[#9D1616] text-white rounded-lg hover:bg-[#7B1111]"
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      }
    </footer>
  `,
  styles: [
    `
      .active {
        background-color: #9D1616;
        color: white !important;
        border-radius: 8px;
      }
      table th, table td {
        min-width: 100px;
      }
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
export class FooterComponent {
  showDropdown = false;
  showFontSizePopup = false;
  showUserSettingsPopup = false;
  showQuizHistoryPopup = false;
  showSettingsPopup = false;
  showAddQuestionPopup = false;
  showAddVocabularyPopup = false;
  showManageVocabularyPopup = false;
  showEditVocabularyPopup = false;
  currentFontSize: number;
  sliderPosition: number;
  private isDragging = false;
  private minFontSize = 12;
  private maxFontSize = 24;
  user: User | null = null;
  quizHistory: QuizHistory[] = [];
  vocabularies: Vocabulary[] = [];
  questionForm: FormGroup;
  vocabularyForm: FormGroup;
  editingVocabularyId: string | null = null;
  isLoading$!: Observable<boolean>;
  isQuizHistoryLoaded = false;
  categories = [
    'ตัวเลข ลำดับ',
    'เกี่ยวกับฉัน',
    'สวัสดีทักท้าย',
    'อาหาร',
    'ท้องถนน',
    'ฤดูกาล',
    'ครอบครัว'
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private fontSizeService: FontSizeService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private fb: FormBuilder,
    private spinnerService: SpinnerService
  ) {
    this.isLoading$ = this.spinnerService.isLoading$;
    this.currentFontSize = this.fontSizeService.getFontSize();
    this.sliderPosition = this.calculateSliderPosition(this.currentFontSize);
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.cdr.markForCheck();
    });
    this.fontSizeService.fontSize$.subscribe(size => {
      this.currentFontSize = size;
      this.sliderPosition = this.calculateSliderPosition(size);
      this.cdr.markForCheck();
    });
    this.questionForm = this.fb.group({
      type: ['game', Validators.required],
      category: ['', Validators.required],
      text: ['', Validators.required],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ]),
      answerIndex: ['', [Validators.required, Validators.min(1), Validators.max(4)]],
      base64Data: ['', Validators.required],
      mimeType: ['', Validators.required],
      caption: ['', Validators.required]
    });
    this.vocabularyForm = this.fb.group({
      chWord: ['', Validators.required],
      pinYin: ['', Validators.required],
      thWord: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  get optionsFormArray(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const maxSizeInMB = 5;
      if (file.size > maxSizeInMB * 1024 * 1024) {
        alert(`ขนาดไฟล์ต้องไม่เกิน ${maxSizeInMB}MB`);
        return;
      }
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        alert('อนุญาตเฉพาะไฟล์ PNG และ JPEG');
        return;
      }
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxWidth = 800;
        const maxHeight = 800;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        const base64Data = canvas.toDataURL(file.type, 0.7);
        this.questionForm.patchValue({
          base64Data,
          mimeType: file.type
        });
        this.questionForm.get('base64Data')?.markAsTouched();
        this.cdr.markForCheck();
        URL.revokeObjectURL(img.src);
      };
    }
  }

  onVocabularyFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const maxSizeInMB = 5;
      if (file.size > maxSizeInMB * 1024 * 1024) {
        alert(`ขนาดไฟล์ต้องไม่เกิน ${maxSizeInMB}MB`);
        return;
      }
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        alert('อนุญาตเฉพาะไฟล์ PNG และ JPEG');
        return;
      }
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxWidth = 800;
        const maxHeight = 800;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        const base64Data = canvas.toDataURL(file.type, 0.7);
        this.vocabularyForm.patchValue({ image: base64Data });
        this.vocabularyForm.get('image')?.markAsTouched();
        this.cdr.markForCheck();
        URL.revokeObjectURL(img.src);
      };
    }
  }

  submitQuestions() {
    this.questionForm.markAllAsTouched();
    if (this.questionForm.invalid) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    if (!confirm('คุณต้องการส่งคำถามหรือไม่?')) {
      return;
    }
    this.spinnerService.show();
    const question: NewQuestion = {
      ...this.questionForm.value,
      answerIndex: this.questionForm.value.answerIndex - 1
    };
    this.http
      .post(`${environment.apiUrl}/quizzes/insert-quiz`, question, {
        headers: this.user?.token ? { Authorization: `Bearer ${this.user.token}` } : {}
      })
      .subscribe({
        next: () => {
          alert('ส่งคำถามสำเร็จ!');
          this.spinnerService.hide();
          this.closeAddQuestionPopup();
          this.cdr.markForCheck();
        },
        error: (error) => {
          alert('เกิดข้อผิดพลาดในการส่งคำถาม: ' + error.message);
          this.spinnerService.hide();
          this.cdr.markForCheck();
        }
      });
  }

  submitVocabulary() {
    this.vocabularyForm.markAllAsTouched();
    if (this.vocabularyForm.invalid) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    if (!confirm('คุณต้องการเพิ่มคำศัพท์หรือไม่?')) {
      return;
    }
    this.spinnerService.show();
    const vocabulary = this.vocabularyForm.value;
    this.http
      .post(`${environment.apiUrl}/words`, vocabulary, {
        headers: this.user?.token ? { Authorization: `Bearer ${this.user.token}` } : {}
      })
      .subscribe({
        next: () => {
          alert('เพิ่มคำศัพท์สำเร็จ!');
          this.spinnerService.hide();
          this.closeAddVocabularyPopup();
          this.cdr.markForCheck();
        },
        error: (error) => {
          alert('เกิดข้อผิดพลาดในการเพิ่มคำศัพท์: ' + error.message);
          this.spinnerService.hide();
          this.cdr.markForCheck();
        }
      });
  }

  submitEditVocabulary() {
    this.vocabularyForm.markAllAsTouched();
    if (this.vocabularyForm.invalid) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    if (!confirm('คุณต้องการแก้ไขคำศัพท์หรือไม่?')) {
      return;
    }
    this.spinnerService.show();
    const vocabulary = this.vocabularyForm.value;
    this.http
      .put(`${environment.apiUrl}/words/${this.editingVocabularyId}`, vocabulary, {
        headers: this.user?.token ? { Authorization: `Bearer ${this.user.token}` } : {}
      })
      .subscribe({
        next: () => {
          alert('แก้ไขคำศัพท์สำเร็จ!');
          this.spinnerService.hide();
          this.closeEditVocabularyPopup();
          this.loadVocabularies();
          this.cdr.markForCheck();
        },
        error: (error) => {
          alert('เกิดข้อผิดพลาดในการแก้ไขคำศัพท์: ' + error.message);
          this.spinnerService.hide();
          this.cdr.markForCheck();
        }
      });
  }

  loadQuestionsFromJson(jsonQuestions: NewQuestion[]) {
    const question = jsonQuestions[0] || {
      type: 'game',
      category: '',
      text: '',
      options: ['', '', '', ''],
      answerIndex: 0,
      base64Data: '',
      mimeType: '',
      caption: ''
    };
    this.questionForm.patchValue({
      type: question.type,
      category: question.category,
      text: question.text,
      answerIndex: question.answerIndex + 1,
      base64Data: question.base64Data,
      mimeType: question.mimeType,
      caption: question.caption
    });
    const options = this.optionsFormArray;
    question.options.forEach((option, index) => {
      options.at(index).setValue(option);
    });
    this.cdr.markForCheck();
  }

  loadVocabularies() {
    this.spinnerService.show();
    this.http
      .get<Vocabulary[]>(`${environment.apiUrl}/words`, {
        headers: this.user?.token ? { Authorization: `Bearer ${this.user.token}` } : {}
      })
      .subscribe({
        next: (response) => {
          this.vocabularies = response;
          this.spinnerService.hide();
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error fetching vocabularies:', error);
          this.vocabularies = [];
          this.spinnerService.hide();
          this.cdr.markForCheck();
        }
      });
  }

  editVocabulary(vocab: Vocabulary) {
    this.vocabularyForm.patchValue({
      chWord: vocab.chWord,
      pinYin: vocab.pinYin,
      thWord: vocab.thWord,
      image: vocab.image
    });
    this.vocabularyForm.get('image')?.markAsTouched();
    this.editingVocabularyId = vocab._id;
    this.showEditVocabularyPopup = true;
    this.showManageVocabularyPopup = false;
    this.cdr.markForCheck();
  }

  deleteVocabulary(id: string) {
    if (!confirm('คุณต้องการลบคำศัพท์นี้หรือไม่?')) {
      return;
    }
    this.spinnerService.show();
    this.http
      .delete(`${environment.apiUrl}/words/${id}`, {
        headers: this.user?.token ? { Authorization: `Bearer ${this.user.token}` } : {}
      })
      .subscribe({
        next: () => {
          alert('ลบคำศัพท์สำเร็จ!');
          this.loadVocabularies();
          this.spinnerService.hide();
          this.cdr.markForCheck();
        },
        error: (error) => {
          alert('เกิดข้อผิดพลาดในการลบคำศัพท์: ' + error.message);
          this.spinnerService.hide();
          this.cdr.markForCheck();
        }
      });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    if (!this.showDropdown) {
      this.showFontSizePopup = false;
      this.showUserSettingsPopup = false;
      this.showQuizHistoryPopup = false;
      this.showSettingsPopup = false;
      this.showAddQuestionPopup = false;
      this.showAddVocabularyPopup = false;
      this.showManageVocabularyPopup = false;
      this.showEditVocabularyPopup = false;
    }
    this.cdr.markForCheck();
  }

  closeDropdown() {
    this.showDropdown = false;
    this.showFontSizePopup = false;
    this.showUserSettingsPopup = false;
    this.showQuizHistoryPopup = false;
    this.showSettingsPopup = false;
    this.showAddQuestionPopup = false;
    this.showAddVocabularyPopup = false;
    this.showManageVocabularyPopup = false;
    this.showEditVocabularyPopup = false;
    this.isQuizHistoryLoaded = false;
    this.cdr.markForCheck();
  }

  toggleSettingsPopup() {
    this.showSettingsPopup = !this.showSettingsPopup;
    this.showDropdown = false;
    this.showFontSizePopup = false;
    this.showUserSettingsPopup = false;
    this.showQuizHistoryPopup = false;
    this.showAddQuestionPopup = false;
    this.showAddVocabularyPopup = false;
    this.showManageVocabularyPopup = false;
    this.showEditVocabularyPopup = false;
    this.isQuizHistoryLoaded = false;
    this.cdr.markForCheck();
  }

  closeSettingsPopup() {
    this.showSettingsPopup = false;
    this.cdr.markForCheck();
  }

  openAddQuestion() {
    this.showAddQuestionPopup = true;
    this.showSettingsPopup = false;
    this.cdr.markForCheck();
  }

  closeAddQuestionPopup() {
    this.showAddQuestionPopup = false;
    this.questionForm.reset({
      type: 'game',
      category: '',
      text: '',
      options: ['', '', '', ''],
      answerIndex: '',
      base64Data: '',
      mimeType: '',
      caption: ''
    });
    this.cdr.markForCheck();
  }

  openDeleteQuestion() {
    console.log('Delete Question: Waiting for API implementation');
    this.showSettingsPopup = false;
    this.cdr.markForCheck();
  }

  openAddVocabulary() {
    this.vocabularyForm.reset({
      chWord: '',
      pinYin: '',
      thWord: '',
      image: ''
    });
    this.editingVocabularyId = null;
    this.showAddVocabularyPopup = true;
    this.showSettingsPopup = false;
    this.cdr.markForCheck();
  }

  closeAddVocabularyPopup() {
    this.showAddVocabularyPopup = false;
    this.vocabularyForm.reset({
      chWord: '',
      pinYin: '',
      thWord: '',
      image: ''
    });
    this.cdr.markForCheck();
  }

  openManageVocabulary() {
    this.showManageVocabularyPopup = true;
    this.showSettingsPopup = false;
    this.loadVocabularies();
    this.cdr.markForCheck();
  }

  closeManageVocabularyPopup() {
    this.showManageVocabularyPopup = false;
    this.cdr.markForCheck();
  }

  closeEditVocabularyPopup() {
    this.showEditVocabularyPopup = false;
    this.vocabularyForm.reset({
      chWord: '',
      pinYin: '',
      thWord: '',
      image: ''
    });
    this.editingVocabularyId = null;
    this.cdr.markForCheck();
  }

  toggleFontSizePopup() {
    this.showFontSizePopup = !this.showFontSizePopup;
    this.showDropdown = false;
    this.showUserSettingsPopup = false;
    this.showQuizHistoryPopup = false;
    this.showSettingsPopup = false;
    this.showAddQuestionPopup = false;
    this.showAddVocabularyPopup = false;
    this.showManageVocabularyPopup = false;
    this.showEditVocabularyPopup = false;
    this.isQuizHistoryLoaded = false;
    this.cdr.markForCheck();
  }

  toggleUserSettingsPopup() {
    this.showUserSettingsPopup = !this.showUserSettingsPopup;
    this.showDropdown = false;
    this.showFontSizePopup = false;
    this.showQuizHistoryPopup = false;
    this.showSettingsPopup = false;
    this.showAddQuestionPopup = false;
    this.showAddVocabularyPopup = false;
    this.showManageVocabularyPopup = false;
    this.showEditVocabularyPopup = false;
    this.isQuizHistoryLoaded = false;
    this.cdr.markForCheck();
  }

  toggleQuizHistoryPopup() {
    this.showQuizHistoryPopup = !this.showQuizHistoryPopup;
    this.showDropdown = false;
    this.showFontSizePopup = false;
    this.showUserSettingsPopup = false;
    this.showSettingsPopup = false;
    this.showAddQuestionPopup = false;
    this.showAddVocabularyPopup = false;
    this.showManageVocabularyPopup = false;
    this.showEditVocabularyPopup = false;
    if (this.showQuizHistoryPopup && this.user?.token) {
      this.isQuizHistoryLoaded = false;
      this.quizHistory = [];
      this.spinnerService.show();
      this.http.get<QuizHistory[]>(`${environment.apiUrl}/quiz-history/me`, {
        headers: { Authorization: `Bearer ${this.user.token}` }
      }).subscribe({
        next: (response) => {
          this.quizHistory = response;
          this.isQuizHistoryLoaded = true;
          this.spinnerService.hide();
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error fetching quiz history:', error);
          this.quizHistory = [];
          this.isQuizHistoryLoaded = true;
          this.spinnerService.hide();
          this.cdr.markForCheck();
        }
      });
    } else {
      this.isQuizHistoryLoaded = false;
      this.quizHistory = [];
    }
    this.cdr.markForCheck();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  startDragging(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this.isDragging = true;
    const slider = (event.target as HTMLElement).closest('.relative');
    if (!slider) return;
    const updateFontSize = (clientX: number) => {
      const rect = slider.getBoundingClientRect();
      const offsetX = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = offsetX / rect.width;
      this.sliderPosition = percentage * 100;
      const fontSize = Math.round(
        this.minFontSize + (this.maxFontSize - this.minFontSize) * percentage
      );
      this.currentFontSize = fontSize;
      this.fontSizeService.setFontSize(fontSize);
      this.cdr.markForCheck();
    };
    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!this.isDragging) return;
      const clientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      updateFontSize(clientX);
    };
    const onStop = () => {
      this.isDragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('mouseup', onStop);
      document.removeEventListener('touchend', onStop);
    };
    if ('touches' in event) {
      updateFontSize(event.touches[0].clientX);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onStop);
    } else {
      updateFontSize((event as MouseEvent).clientX);
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onStop);
    }
  }

  getRoundedPercentage(): number {
    return Math.round(this.sliderPosition);
  }

  private calculateSliderPosition(fontSize: number): number {
    return ((fontSize - this.minFontSize) / (this.maxFontSize - this.minFontSize)) * 100;
  }

  logout() {
    this.authService.logout();
    this.showDropdown = false;
    this.isQuizHistoryLoaded = false;
    this.quizHistory = [];
    this.router.navigateByUrl('/').then(success => {
      console.log('Navigation success:', success);
    }).catch(error => {
      console.error('Navigation error:', error);
    });
    this.cdr.markForCheck();
  }
}
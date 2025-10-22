import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth.service';
import { FontSizeService } from '../../font-size.service';

interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
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
    `
  ]
})
export class FooterComponent {
  showDropdown = false;
  showFontSizePopup = false;
  showUserSettingsPopup = false;
  currentFontSize: number;
  sliderPosition: number;
  private isDragging = false;
  private minFontSize = 12;
  private maxFontSize = 24;
  user: User | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fontSizeService: FontSizeService,
    private cdr: ChangeDetectorRef
  ) {
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
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    if (!this.showDropdown) {
      this.showFontSizePopup = false;
      this.showUserSettingsPopup = false;
    }
  }

  closeDropdown() {
    this.showDropdown = false;
    this.showFontSizePopup = false;
    this.showUserSettingsPopup = false;
  }

  toggleFontSizePopup() {
    this.showFontSizePopup = !this.showFontSizePopup;
    this.showDropdown = false;
    this.showUserSettingsPopup = false;
  }

  toggleUserSettingsPopup() {
    this.showUserSettingsPopup = !this.showUserSettingsPopup;
    this.showDropdown = false;
    this.showFontSizePopup = false;
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
    this.router.navigateByUrl('/').then(success => {
      console.log('Navigation success:', success);
    }).catch(error => {
      console.error('Navigation error:', error);
    });
  }
}
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// กำหนดโครงสร้างข้อมูลสำหรับแต่ละโหมดของเกม
interface GameMode {
  name: string;
  description: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
    /* สีหลักที่ใช้ในแอปพลิเคชัน (สีแดงเข้ม) */
    .main-color {
      color: #9D1616;
    }
    /* สีพื้นหลังสำหรับปุ่ม (สีขาวนวล) */
    .button-bg {
      background-color: #FDFAFA;
    }
    /* สไตล์สำหรับปุ่มโหมดเมื่อถูกเน้น */
    .focus-ring {
      box-shadow: 0 0 0 4px rgba(157, 22, 22, 0.5); /* #9D1616 50% opacity */
    }
  `
  ],
  template: `
    <!-- ส่วนหลักของเนื้อหา จัดให้อยู่ตรงกลางและเต็มพื้นที่ -->
    <main class="flex-grow p-4 sm:p-8  mx-auto w-full min-h-[calc(100vh-8rem)] bg-gray-50">
      <div class="h-full flex flex-col items-center justify-center">
        <!-- คอนเทนเนอร์สำหรับปุ่มโหมด จำกัดความกว้าง -->
        <div class="flex flex-col gap-4 w-full max-w-lg mx-auto">
          
          @for (mode of modes(); track mode.name) {
            <!-- ปุ่มสำหรับเลือกโหมด -->
            <button 
              (click)="selectMode(mode)"
              [attr.aria-label]="mode.description"
              class="mode-button button-bg flex items-center justify-center
                     w-full min-h-[80px] p-4 sm:p-6 rounded-2xl border-2 border-gray-200 
                     shadow-lg transition-all duration-300 transform 
                     hover:bg-[#FFF5F5] hover:shadow-xl hover:scale-[1.01]
                     focus:outline-none focus:ring-4 focus:ring-[#9D1616] focus:ring-opacity-50">
              
              <!-- ชื่อโหมด (ไม่มีไอคอนตามที่ร้องขอ) -->
              <span class="text-2xl font-bold main-color tracking-wider">
                {{ mode.name }}
              </span>
            </button>
          }
        </div>

        <!-- แสดงผลโหมดที่ถูกเลือก -->
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
  // รายการโหมดการเรียนรู้
  modes = signal<GameMode[]>([
    { name: 'โฆษณา', description: 'โฆษณา' },
    { name: 'ทำทดสอบก่อนเรียน', description: 'ทำทดสอบก่อนเรียน' },
  ]);

  // โหมดที่ถูกเลือกในปัจจุบัน
  selectedMode = signal<GameMode | null>(null);

  /**
   * ตั้งค่าโหมดที่ถูกเลือกเมื่อผู้ใช้คลิก
   * @param mode โหมดเกมที่ผู้ใช้เลือก
   */
  selectMode(mode: GameMode): void {
    this.selectedMode.set(mode);
    console.log(`เลือกโหมด: ${mode.name}`);
  }
}

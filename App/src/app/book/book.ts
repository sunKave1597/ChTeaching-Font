import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Topic {
  name: string;
}

@Component({
  selector: 'app-main',
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
    /* พื้นหลังสีตัดกันแนวตั้ง 30% ซ้าย (#9D1616) / 70% ขวา (white) */
    main {
      background: linear-gradient(to right, #9D1616 30%, white 30%);
    }
  `
  ],
  template: `
    <main class="flex-grow p-4 sm:p-8 max-w-7xl mx-auto w-full min-h-[calc(100vh-8rem)]">
      <div class="h-full flex flex-col items-center justify-center">
        
        <!-- คอนเทนเนอร์สำหรับรายการหัวข้อ 7 ปุ่ม -->
        <div class="flex flex-col gap-4 w-full max-w-xl mx-auto py-2">
          
          @for (topic of topics(); track topic.name) {
            <!-- ปรับขนาด (py-4 sm:py-6), เพิ่มขอบและเงา (border shadow-md), และเพิ่มขนาดตัวอักษร (text-xl) -->
            <button 
              (click)="selectTopic(topic)"
              class="w-full text-center text-xl py-4 sm:py-6 rounded-xl font-bold
                     button-bg main-color border border-gray-100 shadow-md 
                     transition-all duration-300 hover:bg-[#F0F0F0] hover:shadow-lg 
                     focus:outline-none focus:ring-4 focus:ring-[#9D1616] focus:ring-opacity-50">
              {{ topic.name }}
            </button>
          }
        </div>

        @if (selectedTopic()) {
          <div class="mt-8 text-center text-xl text-gray-700 p-4 border-t border-gray-200">
            คุณเลือกหัวข้อ: <span class="font-bold main-color">{{ selectedTopic()?.name }}</span>
          </div>
        }
      </div>
    </main>
  `
})
export class BookContainer {
  topics = signal<Topic[]>([
    { name: 'ตัวเลข ลำดับ' },
    { name: 'เกี่ยวกับฉัน' },
    { name: 'สวัสดีทักทาย' },
    { name: 'อาหาร' },
    { name: 'ท้องถนน' },
    { name: 'ฤดูกาล' },
    { name: 'ครอบครัว' },
  ]);

  selectedTopic = signal<Topic | null>(null);

  selectTopic(topic: Topic): void {
    this.selectedTopic.set(topic);
    console.log(`เลือกหัวข้อ: ${topic.name}`);
  }
}

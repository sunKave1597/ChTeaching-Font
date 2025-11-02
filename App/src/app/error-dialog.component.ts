import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; // สำหรับ <button mat-button>

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [
    MatDialogModule,    // ต้องมี: ใช้ mat-dialog-title, mat-dialog-content, mat-dialog-actions
    MatButtonModule     // ต้องมี: ใช้ mat-button
  ],
  template: `
    <div class="p-6">
      <h2 mat-dialog-title class="text-xl font-bold text-red-700">
        เข้าสู่ระบบไม่สำเร็จ
      </h2>

      <mat-dialog-content class="mt-2 text-gray-700">
        {{ data.message }}
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="mt-4">
        <button mat-button (click)="onClose()" class="text-[#9D1616]">
          ตกลง
        </button>
      </mat-dialog-actions>
    </div>
  `,
})
export class ErrorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page-component/landing-page-component';
import { MainContainerComponent } from './main-container-component/main-container-component';
import { LoginLayoutComponent } from './login-layout-component/login-layout-component';
import { RegisterLayoutComponent } from './register-layout.component/register-layout.component';
import { MainComponent } from './main-component/main-component';
import { PuzzleContainer } from './puzzle/puzzle';
import { BookContainer } from './book/book';
import { GuessWordGameComponent } from './guess-word-game/guess-word-game';

export const routes: Routes = [
  { path: '', component: LandingPageComponent, title: 'หน้าแรก' },
  { path: 'login', component: LoginLayoutComponent, title: 'เข้าสู่ระบบ' },
  {
    path: '',
    component: MainContainerComponent,
    children: [
      { path: 'home', component: MainComponent, title: 'หน้าหลัก' },
      { path: 'puzzle', component: PuzzleContainer, title: 'เกม' },
      { path: 'puzzle/guess-word', component: GuessWordGameComponent, title: 'ทายคำศัพท์' },
      { path: 'book', component: BookContainer, title: 'แบบทดสอบก่อนเรียน' }
    ]
  },
  { path: 'register', component: RegisterLayoutComponent, title: 'สมัครสมาชิก' },
  { path: '**', redirectTo: '' }
];
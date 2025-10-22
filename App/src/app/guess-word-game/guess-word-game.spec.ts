import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessWordGame } from './guess-word-game';

describe('GuessWordGame', () => {
  let component: GuessWordGame;
  let fixture: ComponentFixture<GuessWordGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessWordGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuessWordGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

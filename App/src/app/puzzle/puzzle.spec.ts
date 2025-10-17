import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleContainer } from './puzzle';

describe('Puzzle', () => {
  let component: PuzzleContainer;
  let fixture: ComponentFixture<PuzzleContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuzzleContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuzzleContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

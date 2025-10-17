import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookContainer } from './book';

describe('Book', () => {
  let component: BookContainer;
  let fixture: ComponentFixture<BookContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

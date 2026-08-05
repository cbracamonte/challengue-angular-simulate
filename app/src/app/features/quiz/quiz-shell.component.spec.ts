import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { QuizShell } from './quiz-shell.component';

describe('QuizShell', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [QuizShell], providers: [provideRouter([])] });
  });

  it('renders the topic picker when idle', () => {
    const fixture = TestBed.createComponent(QuizShell);
    fixture.detectChanges();
    const checkboxes = (fixture.nativeElement as HTMLElement).querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('starts the quiz and shows the first question', () => {
    const fixture = TestBed.createComponent(QuizShell);
    fixture.detectChanges();
    fixture.componentInstance['start']();
    fixture.detectChanges();
    expect(fixture.componentInstance['store'].status()).toBe('running');
  });
});

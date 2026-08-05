import { TestBed } from '@angular/core/testing';
import { QuestionCard } from './question-card.component';
import { QuizQuestion } from './question-bank';

const sampleQuestion: QuizQuestion = {
  id: 'q1',
  topic: 'standalone-signals',
  prompt: 'Sample prompt?',
  options: [
    { id: 'a', text: 'Option A' },
    { id: 'b', text: 'Option B' },
  ],
  correctOptionId: 'a',
  explanation: 'Because A.',
  difficulty: 'mid',
  timeLimitSeconds: 30,
};

describe('QuestionCard', () => {
  it('renders one button per option and emits select on click', () => {
    const fixture = TestBed.createComponent(QuestionCard);
    fixture.componentRef.setInput('question', sampleQuestion);
    fixture.detectChanges();

    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll('button');
    expect(buttons.length).toBe(2);

    let emitted: string | undefined;
    fixture.componentInstance.select.subscribe((id) => (emitted = id));
    (buttons[1] as HTMLButtonElement).click();
    expect(emitted).toBe('b');
  });
});

import { Component, input, output } from '@angular/core';
import { QuizQuestion } from './question-bank';

@Component({
  selector: 'app-question-card',
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss',
})
export class QuestionCard {
  readonly question = input.required<QuizQuestion>();
  readonly selectedOptionId = input<string | null>(null);
  readonly select = output<string>();
}

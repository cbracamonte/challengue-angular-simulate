import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { QuizStore } from './quiz-store';
import { QuestionCard } from './question-card.component';
import { QUESTION_BANK, QuizTopic, TOPIC_LABELS } from './question-bank';

@Component({
  selector: 'app-quiz-shell',
  imports: [RouterLink, MatButtonModule, MatProgressBarModule, QuestionCard],
  providers: [QuizStore],
  templateUrl: './quiz-shell.component.html',
  styleUrl: './quiz-shell.component.scss',
})
export class QuizShell {
  protected readonly store = inject(QuizStore);

  protected readonly allTopics = Object.keys(TOPIC_LABELS) as QuizTopic[];
  protected readonly topicLabels = TOPIC_LABELS;
  protected readonly selectedTopics = signal<QuizTopic[]>([]);

  protected readonly poolSize = computed(() => {
    const topics = this.selectedTopics();
    return topics.length === 0
      ? QUESTION_BANK.length
      : QUESTION_BANK.filter((q) => topics.includes(q.topic)).length;
  });

  protected toggleTopic(topic: QuizTopic): void {
    this.selectedTopics.update((topics) =>
      topics.includes(topic) ? topics.filter((t) => t !== topic) : [...topics, topic],
    );
  }

  protected start(): void {
    this.store.start(this.selectedTopics(), Math.min(12, this.poolSize()));
  }

  protected restart(): void {
    this.selectedTopics.set([]);
    this.store.restart();
  }
}

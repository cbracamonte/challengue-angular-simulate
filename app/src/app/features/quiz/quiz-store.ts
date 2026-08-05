import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { QUESTION_BANK, QuizQuestion, QuizTopic, TOPIC_LABELS } from './question-bank';

export type QuizStatus = 'idle' | 'running' | 'finished';

interface AnsweredQuestion {
  question: QuizQuestion;
  selectedOptionId: string | null;
  correct: boolean;
}

function shuffled<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Con scope de ruta (no root) para que cada visita a /quiz arranque limpia —
 * ver providers en app.routes.ts / quiz.routes.ts.
 */
@Injectable()
export class QuizStore {
  private readonly destroyRef = inject(DestroyRef);
  private timerHandle: ReturnType<typeof setInterval> | null = null;

  readonly status = signal<QuizStatus>('idle');
  readonly questions = signal<QuizQuestion[]>([]);
  readonly currentIndex = signal(0);
  readonly answered = signal<AnsweredQuestion[]>([]);
  readonly timeRemaining = signal(0);
  readonly selectedOptionId = signal<string | null>(null);

  readonly currentQuestion = computed<QuizQuestion | undefined>(() => this.questions()[this.currentIndex()]);
  readonly isLastQuestion = computed(() => this.currentIndex() === this.questions().length - 1);
  readonly progressLabel = computed(() => `${this.currentIndex() + 1} / ${this.questions().length}`);

  readonly hasAnswered = computed(() => this.selectedOptionId() !== null);
  readonly isSelectedCorrect = computed(
    () => this.hasAnswered() && this.currentQuestion()?.correctOptionId === this.selectedOptionId(),
  );

  readonly score = computed(() => this.answered().filter((a) => a.correct).length);
  readonly scorePercent = computed(() =>
    this.answered().length === 0 ? 0 : Math.round((this.score() / this.answered().length) * 100),
  );

  readonly topicBreakdown = computed(() => {
    const byTopic = new Map<QuizTopic, { correct: number; total: number }>();
    for (const entry of this.answered()) {
      const bucket = byTopic.get(entry.question.topic) ?? { correct: 0, total: 0 };
      bucket.total += 1;
      if (entry.correct) bucket.correct += 1;
      byTopic.set(entry.question.topic, bucket);
    }
    return [...byTopic.entries()].map(([topic, stats]) => ({
      topic,
      label: TOPIC_LABELS[topic],
      ...stats,
      percent: Math.round((stats.correct / stats.total) * 100),
    }));
  });

  constructor() {
    this.destroyRef.onDestroy(() => this.clearTimer());
  }

  start(topics: QuizTopic[] = [], count = 10): void {
    const pool = topics.length === 0 ? QUESTION_BANK : QUESTION_BANK.filter((q) => topics.includes(q.topic));
    this.questions.set(shuffled(pool).slice(0, count));
    this.currentIndex.set(0);
    this.answered.set([]);
    this.status.set('running');
    this.beginQuestionTimer();
  }

  selectAnswer(optionId: string): void {
    if (this.status() !== 'running' || this.hasAnswered()) return;
    this.clearTimer();
    this.selectedOptionId.set(optionId);
  }

  confirmAndNext(): void {
    const question = this.currentQuestion();
    if (!question || this.status() !== 'running') return;

    this.clearTimer();
    const selected = this.selectedOptionId();
    this.answered.update((list) => [
      ...list,
      { question, selectedOptionId: selected, correct: selected === question.correctOptionId },
    ]);

    if (this.isLastQuestion()) {
      this.status.set('finished');
      return;
    }
    this.currentIndex.update((i) => i + 1);
    this.selectedOptionId.set(null);
    this.beginQuestionTimer();
  }

  restart(): void {
    this.clearTimer();
    this.status.set('idle');
    this.questions.set([]);
    this.answered.set([]);
    this.currentIndex.set(0);
    this.selectedOptionId.set(null);
  }

  private beginQuestionTimer(): void {
    this.clearTimer();
    const question = this.currentQuestion();
    if (!question) return;
    this.timeRemaining.set(question.timeLimitSeconds);
    this.timerHandle = setInterval(() => {
      this.timeRemaining.update((t) => t - 1);
      if (this.timeRemaining() <= 0) {
        this.confirmAndNext();
      }
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timerHandle !== null) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
  }
}

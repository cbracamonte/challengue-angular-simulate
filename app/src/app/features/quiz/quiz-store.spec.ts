import { TestBed } from '@angular/core/testing';
import { QuizStore } from './quiz-store';

describe('QuizStore', () => {
  let store: QuizStore;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [QuizStore] });
    store = TestBed.inject(QuizStore);
  });

  it('starts idle with no questions loaded', () => {
    expect(store.status()).toBe('idle');
    expect(store.questions().length).toBe(0);
  });

  it('loads the requested number of questions and moves to running', () => {
    store.start([], 5);
    expect(store.status()).toBe('running');
    expect(store.questions().length).toBe(5);
    expect(store.currentQuestion()).toBeTruthy();
  });

  it('filters the pool by topic', () => {
    store.start(['git-process'], 10);
    expect(store.questions().every((q) => q.topic === 'git-process')).toBeTrue();
  });

  it('marks hasAnswered and isSelectedCorrect right after selecting', () => {
    store.start([], 3);
    const question = store.currentQuestion()!;
    store.selectAnswer(question.correctOptionId);
    expect(store.hasAnswered()).toBeTrue();
    expect(store.isSelectedCorrect()).toBeTrue();
  });

  it('ignores a second selectAnswer once already answered', () => {
    store.start([], 3);
    const question = store.currentQuestion()!;
    const wrongOption = question.options.find((o) => o.id !== question.correctOptionId)!.id;
    store.selectAnswer(wrongOption);
    store.selectAnswer(question.correctOptionId);
    expect(store.selectedOptionId()).toBe(wrongOption);
  });

  it('advances to the next question on confirmAndNext and resets selection', () => {
    store.start([], 3);
    const first = store.currentQuestion()!;
    store.selectAnswer(first.correctOptionId);
    store.confirmAndNext();

    expect(store.currentIndex()).toBe(1);
    expect(store.selectedOptionId()).toBeNull();
    expect(store.answered().length).toBe(1);
    expect(store.answered()[0].correct).toBeTrue();
  });

  it('finishes after the last question and computes score', () => {
    store.start([], 2);
    for (let i = 0; i < 2; i++) {
      const q = store.currentQuestion()!;
      store.selectAnswer(q.correctOptionId);
      store.confirmAndNext();
    }
    expect(store.status()).toBe('finished');
    expect(store.score()).toBe(2);
    expect(store.scorePercent()).toBe(100);
  });

  it('counts a timed-out question (no selection) as incorrect', () => {
    jasmine.clock().install();
    try {
      store.start([], 1);
      const q = store.currentQuestion()!;
      jasmine.clock().tick((q.timeLimitSeconds + 1) * 1000);

      expect(store.status()).toBe('finished');
      expect(store.answered()[0].selectedOptionId).toBeNull();
      expect(store.answered()[0].correct).toBeFalse();
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('restart returns to idle and clears state', () => {
    store.start([], 2);
    store.restart();
    expect(store.status()).toBe('idle');
    expect(store.questions().length).toBe(0);
    expect(store.answered().length).toBe(0);
  });
});

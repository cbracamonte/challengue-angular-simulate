import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LIVE_CODING_BRIEFS, LiveCodingBrief } from './live-coding-briefs';

const GIT_CHECKLIST = [
  'Clarifiqué el alcance con el cliente antes de tocar código',
  'Pensé en voz alta: mencioné al menos un trade-off técnico',
  'Corrí los tests existentes antes de empezar (baseline)',
  'Hice commits atómicos con mensaje convencional (feat/fix/refactor)',
  'Me autorevisé el diff antes de decir "listo" (self code review)',
  'Traduje el impacto técnico a una frase que un no-técnico entendería',
];

@Component({
  selector: 'app-live-coding',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule],
  templateUrl: './live-coding.component.html',
  styleUrl: './live-coding.component.scss',
})
export class LiveCoding {
  private readonly destroyRef = inject(DestroyRef);
  private timerHandle: ReturnType<typeof setInterval> | null = null;

  protected readonly briefs: LiveCodingBrief[] = LIVE_CODING_BRIEFS;
  protected readonly checklist = GIT_CHECKLIST;

  protected readonly selectedBrief = signal<LiveCodingBrief>(LIVE_CODING_BRIEFS[0]);
  protected readonly secondsElapsed = signal(0);
  protected readonly isRunning = signal(false);
  protected readonly checkedItems = signal<Set<string>>(new Set());

  protected readonly elapsedLabel = computed(() => {
    const total = this.secondsElapsed();
    const minutes = Math.floor(total / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (total % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  });

  protected readonly isOverBudget = computed(
    () => this.secondsElapsed() > this.selectedBrief().timeLimitMinutes * 60,
  );

  constructor() {
    this.destroyRef.onDestroy(() => this.clearTimer());
  }

  protected selectBrief(brief: LiveCodingBrief): void {
    this.pause();
    this.selectedBrief.set(brief);
    this.secondsElapsed.set(0);
    this.checkedItems.set(new Set());
  }

  protected toggleStart(): void {
    this.isRunning() ? this.pause() : this.start();
  }

  protected reset(): void {
    this.pause();
    this.secondsElapsed.set(0);
  }

  protected toggleChecklistItem(item: string): void {
    this.checkedItems.update((items) => {
      const next = new Set(items);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  }

  private start(): void {
    this.isRunning.set(true);
    this.timerHandle = setInterval(() => this.secondsElapsed.update((s) => s + 1), 1000);
  }

  private pause(): void {
    this.isRunning.set(false);
    this.clearTimer();
  }

  private clearTimer(): void {
    if (this.timerHandle !== null) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
  }
}

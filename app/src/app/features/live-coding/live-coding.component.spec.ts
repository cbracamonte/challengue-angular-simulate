import { TestBed } from '@angular/core/testing';
import { LiveCoding } from './live-coding.component';

describe('LiveCoding', () => {
  it('creates with the first brief selected and timer at 0', () => {
    TestBed.configureTestingModule({ imports: [LiveCoding] });
    const fixture = TestBed.createComponent(LiveCoding);
    fixture.detectChanges();

    expect(fixture.componentInstance['secondsElapsed']()).toBe(0);
    expect(fixture.componentInstance['selectedBrief']().id).toBe('filter-signals');
  });

  it('toggles a checklist item on and off', () => {
    TestBed.configureTestingModule({ imports: [LiveCoding] });
    const fixture = TestBed.createComponent(LiveCoding);
    fixture.detectChanges();
    const item = fixture.componentInstance['checklist'][0];

    fixture.componentInstance['toggleChecklistItem'](item);
    expect(fixture.componentInstance['checkedItems']().has(item)).toBeTrue();

    fixture.componentInstance['toggleChecklistItem'](item);
    expect(fixture.componentInstance['checkedItems']().has(item)).toBeFalse();
  });

  it('ticks the timer once per second while running', () => {
    jasmine.clock().install();
    try {
      TestBed.configureTestingModule({ imports: [LiveCoding] });
      const fixture = TestBed.createComponent(LiveCoding);
      fixture.detectChanges();

      fixture.componentInstance['toggleStart']();
      jasmine.clock().tick(3000);

      expect(fixture.componentInstance['secondsElapsed']()).toBe(3);
    } finally {
      jasmine.clock().uninstall();
    }
  });
});

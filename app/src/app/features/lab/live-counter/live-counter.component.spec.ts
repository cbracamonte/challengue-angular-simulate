import { TestBed } from '@angular/core/testing';
import { LiveCounterComponent } from './live-counter.component';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

describe('LiveCounterComponent (objetivo — hacé pasar este test)', () => {
  it('actualiza la pantalla sola cuando cambia el estado, sin volver a llamar detectChanges', async () => {
    const fixture = TestBed.createComponent(LiveCounterComponent);
    fixture.detectChanges(); // primer render
    expect(fixture.nativeElement.textContent).toContain('0');

    await wait(70); // deja correr ~3 ticks del setInterval (20ms c/u)
    // A propósito NO llamamos fixture.detectChanges() de nuevo acá: en
    // producción nadie hace eso por vos. Si esto falla, es porque Angular
    // nunca se enteró del cambio.

    expect(fixture.nativeElement.textContent).not.toContain('0');
  });
});

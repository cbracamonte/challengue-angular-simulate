import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, Subject } from 'rxjs';
import { PolicyList } from './policy-list.component';
import { PolicyService } from './policy.service';
import { Policy } from './policy.model';

const samplePolicies: Policy[] = [
  { id: 'POL-A', holderName: 'Ana', premium: 100, status: 'active' },
  { id: 'POL-B', holderName: 'Bruno', premium: 50, status: 'pending' },
];

describe('PolicyList — dos implementaciones (manual y rxResource)', () => {
  it('ambos paneles renderizan una fila por cada póliza', async () => {
    TestBed.configureTestingModule({
      imports: [PolicyList],
      providers: [provideRouter([]), { provide: PolicyService, useValue: { watchPolicies: () => of(samplePolicies) } }],
    });
    const fixture = TestBed.createComponent(PolicyList);
    fixture.detectChanges();
    await TestBed.inject(ApplicationRef).whenStable();
    fixture.detectChanges();

    const tables = (fixture.nativeElement as HTMLElement).querySelectorAll('tbody');
    expect(tables.length).toBe(2);
    tables.forEach((tbody) => expect(tbody.querySelectorAll('tr').length).toBe(2));
  });

  it('ambos totales dan 150 (manual y resource)', async () => {
    TestBed.configureTestingModule({
      imports: [PolicyList],
      providers: [provideRouter([]), { provide: PolicyService, useValue: { watchPolicies: () => of(samplePolicies) } }],
    });
    const fixture = TestBed.createComponent(PolicyList);
    fixture.detectChanges();
    await TestBed.inject(ApplicationRef).whenStable();

    expect(fixture.componentInstance['totalPremiumManual']()).toBe(150);
    expect(fixture.componentInstance['totalPremiumResource']()).toBe(150);
  });

  it('ninguna de las dos implementaciones deja el feed en vivo suscripto tras destruirse', () => {
    const feed = new Subject<Policy[]>();
    TestBed.configureTestingModule({
      imports: [PolicyList],
      providers: [provideRouter([]), { provide: PolicyService, useValue: { watchPolicies: () => feed.asObservable() } }],
    });
    const fixture = TestBed.createComponent(PolicyList);
    fixture.detectChanges();
    // El feed nunca completa (es un feed en vivo): whenStable() esperaría
    // para siempre. TestBed.tick() dispara los effects/subscriptions
    // iniciales sin esperar a que el stream complete.
    TestBed.tick();

    feed.next(samplePolicies);
    expect(feed.observed).toBeTrue();

    fixture.destroy();
    // Si CUALQUIERA de las dos implementaciones leakea, observed sigue true.
    expect(feed.observed).toBeFalse();
  });
});

import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { PolicyList } from './policy-list.component';
import { PolicyService } from './policy.service';
import { Policy } from './policy.model';

const samplePolicies: Policy[] = [
  { id: 'POL-A', holderName: 'Ana', premium: 100, status: 'active' },
  { id: 'POL-B', holderName: 'Bruno', premium: 50, status: 'pending' },
];

describe('PolicyList (objetivo — hacé pasar estos tests)', () => {
  it('renderiza una fila por cada póliza emitida por PolicyService', () => {
    TestBed.configureTestingModule({
      imports: [PolicyList],
      providers: [{ provide: PolicyService, useValue: { watchPolicies: () => of(samplePolicies) } }],
    });
    const fixture = TestBed.createComponent(PolicyList);
    fixture.detectChanges();

    const rows = (fixture.nativeElement as HTMLElement).querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('deriva totalPremium de las pólizas actuales con computed()', () => {
    TestBed.configureTestingModule({
      imports: [PolicyList],
      providers: [{ provide: PolicyService, useValue: { watchPolicies: () => of(samplePolicies) } }],
    });
    const fixture = TestBed.createComponent(PolicyList);
    fixture.detectChanges();

    expect(fixture.componentInstance['totalPremium']()).toBe(150);
  });

  it('se desuscribe del feed en vivo al destruirse el componente (sin leak)', () => {
    const feed = new Subject<Policy[]>();
    TestBed.configureTestingModule({
      imports: [PolicyList],
      providers: [{ provide: PolicyService, useValue: { watchPolicies: () => feed.asObservable() } }],
    });
    const fixture = TestBed.createComponent(PolicyList);
    fixture.detectChanges();
    feed.next(samplePolicies);
    expect(feed.observed).toBeTrue();

    fixture.destroy();
    expect(feed.observed).toBeFalse();
  });
});

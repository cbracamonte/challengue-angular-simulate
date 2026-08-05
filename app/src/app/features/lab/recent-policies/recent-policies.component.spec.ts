import { TestBed } from '@angular/core/testing';
import { RecentPoliciesComponent } from './recent-policies.component';

describe('RecentPoliciesComponent (objetivo — hacé pasar este test)', () => {
  it('enfoca el input de búsqueda y cuenta las filas sin usar ngOnInit', async () => {
    const fixture = TestBed.createComponent(RecentPoliciesComponent);
    fixture.detectChanges();
    await fixture.whenStable(); // deja correr los effects (son async por diseño)

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(document.activeElement).toBe(input);
    expect(fixture.componentInstance.rowCount()).toBe(2);
  });
});

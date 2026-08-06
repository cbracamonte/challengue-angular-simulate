import { TestBed } from '@angular/core/testing';
import { PremiumCalculatorComponent } from './premium-calculator.component';
import { PREMIUM_CALCULATOR_STORAGE_KEY, TIER_PRICING } from './premium-calculator.model';

describe('PremiumCalculatorComponent (objetivo — hacé pasar estos tests)', () => {
  it('totalPremium suma basePremium + deductible * factor + extraCoverage para el tier actual', () => {
    const fixture = TestBed.createComponent(PremiumCalculatorComponent);
    const component = fixture.componentInstance;

    component.extraCoverage.set(50);

    const expected = TIER_PRICING['estandar'].base + TIER_PRICING['estandar'].deductible * 0.1 + 50;
    expect(component.totalPremium()).toBe(expected);
  });

  it('cambiar selectedTier resetea deductible al valor recomendado, incluso con un override manual previo', () => {
    const fixture = TestBed.createComponent(PremiumCalculatorComponent);
    const component = fixture.componentInstance;

    component.deductible.set(999);
    expect(component.deductible()).toBe(999);

    component.selectedTier.set('premium');

    expect(component.deductible()).toBe(TIER_PRICING['premium'].deductible);
  });

  it('un override manual de deductible sobrevive a un cambio en un signal no relacionado (extraCoverage)', () => {
    const fixture = TestBed.createComponent(PremiumCalculatorComponent);
    const component = fixture.componentInstance;

    component.deductible.set(777);
    component.extraCoverage.set(20);

    expect(component.deductible()).toBe(777);
  });

  it('el effect persiste en localStorage al cambiar tier/deductible, pero no se re-dispara solo por extraCoverage (untracked)', async () => {
    const fixture = TestBed.createComponent(PremiumCalculatorComponent);
    const setItemSpy = spyOn(localStorage, 'setItem');

    fixture.detectChanges();
    await fixture.whenStable(); // deja correr el effect inicial (constructor)

    setItemSpy.calls.reset();

    fixture.componentInstance.extraCoverage.set(42);
    await fixture.whenStable();
    expect(setItemSpy).not.toHaveBeenCalled();

    fixture.componentInstance.selectedTier.set('basico');
    await fixture.whenStable();

    expect(setItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledWith(
      PREMIUM_CALCULATOR_STORAGE_KEY,
      JSON.stringify({ tier: 'basico', deductible: TIER_PRICING['basico'].deductible }),
    );
  });
});

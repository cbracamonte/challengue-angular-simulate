import { TestBed } from '@angular/core/testing';
import { PolicyFormComponent } from './policy-form.component';

describe('PolicyFormComponent (objetivo — hacé pasar estos tests)', () => {
  it('no emite si el formulario es inválido (holderName vacío)', () => {
    const fixture = TestBed.createComponent(PolicyFormComponent);
    const component = fixture.componentInstance;
    const emitSpy = spyOn(component.issue, 'emit');

    component.form.setValue({ holderName: '', premium: 100 });
    component.submit();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('no emite si la prima es 0 o negativa', () => {
    const fixture = TestBed.createComponent(PolicyFormComponent);
    const component = fixture.componentInstance;
    const emitSpy = spyOn(component.issue, 'emit');

    component.form.setValue({ holderName: 'Ana Ríos', premium: 0 });
    component.submit();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('emite el valor cuando el formulario es válido', () => {
    const fixture = TestBed.createComponent(PolicyFormComponent);
    const component = fixture.componentInstance;
    const emitSpy = spyOn(component.issue, 'emit');

    component.form.setValue({ holderName: 'Ana Ríos', premium: 500 });
    component.submit();

    expect(emitSpy).toHaveBeenCalledWith({ holderName: 'Ana Ríos', premium: 500 });
  });
});

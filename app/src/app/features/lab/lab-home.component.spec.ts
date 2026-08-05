import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LabHome } from './lab-home.component';

describe('LabHome', () => {
  it('renders one card per exercise', () => {
    TestBed.configureTestingModule({ imports: [LabHome], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(LabHome);
    fixture.detectChanges();

    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('mat-card');
    expect(cards.length).toBe(fixture.componentInstance['exercises'].length);
  });
});

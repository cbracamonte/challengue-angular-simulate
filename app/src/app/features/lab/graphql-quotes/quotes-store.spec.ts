import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { QuotesStore } from './quotes-store';
import { QuotesRestApi } from './quotes-rest.api';
import { QuotesGraphqlApi } from './quotes-graphql.api';
import { RestQuote, QuoteSummary } from './quote.model';

const restQuotes: RestQuote[] = [
  { id: 'Q-1', product: 'Auto', monthlyPremium: 45, coverageAmount: 15000, internalRiskScore: 0.32, underwriterNotes: 'x' },
];
const graphqlQuotes: QuoteSummary[] = [{ id: 'Q-1', product: 'Auto', monthlyPremium: 45, coverageAmount: 15000 }];

describe('QuotesStore (objetivo — hacé pasar estos tests)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: QuotesRestApi, useValue: { fetchByCustomer: () => of(restQuotes) } },
        { provide: QuotesGraphqlApi, useValue: { fetchByCustomer: () => of(graphqlQuotes) } },
      ],
    });
  });

  it('restQuotes mapea RestQuote a QuoteSummary (sin campos internos)', async () => {
    const store = TestBed.inject(QuotesStore);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(store.restQuotes.value()).toEqual([
      { id: 'Q-1', product: 'Auto', monthlyPremium: 45, coverageAmount: 15000 },
    ]);
  });

  it('graphqlQuotes ya viene con la forma exacta, sin mapeo', async () => {
    const store = TestBed.inject(QuotesStore);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(store.graphqlQuotes.value()).toEqual(graphqlQuotes);
  });

  it('selectCustomer dispara una nueva carga en ambos resources', async () => {
    const fetchByCustomer = jasmine.createSpy('fetchByCustomer').and.returnValue(of(graphqlQuotes));
    TestBed.overrideProvider(QuotesGraphqlApi, { useValue: { fetchByCustomer } });

    const store = TestBed.inject(QuotesStore);
    await TestBed.inject(ApplicationRef).whenStable();
    store.selectCustomer('CUST-002');
    await TestBed.inject(ApplicationRef).whenStable();

    expect(fetchByCustomer).toHaveBeenCalledWith('CUST-002');
  });
});

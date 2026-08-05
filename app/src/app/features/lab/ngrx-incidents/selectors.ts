import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IncidentsState } from './incident.model';

export const selectIncidentsState = createFeatureSelector<IncidentsState>('incidents');

export const selectAllIncidents = createSelector(selectIncidentsState, (state) => state.incidents);

export const selectIncidentsLoading = createSelector(selectIncidentsState, (state) => state.loading);

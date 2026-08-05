import { expect, test } from '@playwright/test';

test('la home muestra el mapa de requisitos y navega a cada módulo', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Refactor y Modernización/i })).toBeVisible();

  await page.getByRole('link', { name: 'Quiz', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Quiz estilo TestGorilla' })).toBeVisible();

  await page.getByRole('link', { name: 'Refactor Lab' }).click();
  await expect(page.getByRole('heading', { name: 'Refactor Lab' })).toBeVisible();
  await expect(page.locator('mat-card')).toHaveCount(4);

  await page.getByRole('link', { name: 'Live Coding' }).click();
  await expect(page.getByRole('heading', { name: 'Live Coding Prep' })).toBeVisible();
});

test('el quiz permite responder una pregunta y avanzar', async ({ page }) => {
  await page.goto('/quiz');
  await page.locator('input[type="checkbox"]').first().check();
  await page.getByRole('button', { name: 'Empezar quiz' }).click();

  await expect(page.locator('article')).toBeVisible();
  await page.locator('article button').first().click();
  await expect(page.getByText(/Correcto|Incorrecto/)).toBeVisible();
});

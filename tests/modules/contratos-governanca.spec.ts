import { test, expect } from '@playwright/test';
import { saveEvidence } from '../helpers/evidence';
import { abrirModulo } from '../helpers/navigation';

test.describe('Contratos', () => {

  test('deve carregar o módulo Contratos', async ({ page }) => {
    await abrirModulo(page, 'contratos');
    await saveEvidence(page, 'contratos-carregado');
    await expect(page).not.toHaveURL(/login/i);
  });

});

test.describe('Governança', () => {

  test('deve carregar o módulo Governança', async ({ page }) => {
    await abrirModulo(page, 'governanca');
    await saveEvidence(page, 'governanca-carregado');
    await expect(page).not.toHaveURL(/login/i);
  });

});

import { test, expect } from '@playwright/test';
import { saveEvidence } from '../helpers/evidence';
import { abrirModulo } from '../helpers/navigation';

test.describe('Compras', () => {

  test('deve carregar o módulo Compras', async ({ page }) => {
    await abrirModulo(page, 'compras');
    await saveEvidence(page, 'compras-carregado');
    await expect(page).not.toHaveURL(/login/i);
  });

});

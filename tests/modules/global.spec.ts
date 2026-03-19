import { test, expect } from '@playwright/test';
import { saveEvidence } from '../helpers/evidence';
import { abrirModulo } from '../helpers/navigation';

test.describe('Global', () => {

  test('deve carregar o módulo Global', async ({ page }) => {
    await abrirModulo(page, 'global');
    await saveEvidence(page, 'global-carregado');
    await expect(page).not.toHaveURL(/login/i);
  });

});

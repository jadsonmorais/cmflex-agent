import { test, expect } from '@playwright/test';
import { saveEvidence } from '../helpers/evidence';
import { abrirModulo } from '../helpers/navigation';

test.describe('Contabilidade', () => {

  test('deve carregar o módulo Contabilidade', async ({ page }) => {
    await abrirModulo(page, 'contabilidade');
    await saveEvidence(page, 'contabilidade-carregado');
    await expect(page).not.toHaveURL(/login/i);
  });

});

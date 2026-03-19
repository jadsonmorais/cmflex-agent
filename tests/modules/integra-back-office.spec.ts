import { test, expect } from '@playwright/test';
import { saveEvidence } from '../helpers/evidence';
import { abrirModulo } from '../helpers/navigation';

test.describe('Integra-Back-Office', () => {

  test('deve carregar o módulo Integra Front Office', async ({ page }) => {
    await abrirModulo(page, 'integraBackOffice');
    await saveEvidence(page, 'integra-back-office-carregado');
    await expect(page).not.toHaveURL(/login/i);
  });

});

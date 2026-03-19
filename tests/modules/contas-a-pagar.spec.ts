import { test, expect } from '@playwright/test';
import { saveEvidence } from '../helpers/evidence';
import { abrirModulo } from '../helpers/navigation';

test.describe('Contas a Pagar', () => {

  test('deve carregar o módulo Contas a Pagar', async ({ page }) => {
    await abrirModulo(page, 'contasAPagar');
    await saveEvidence(page, 'contas-a-pagar-carregado');
    await expect(page).not.toHaveURL(/login/i);
  });

});

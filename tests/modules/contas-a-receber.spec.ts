import { test, expect } from '@playwright/test';
import { saveEvidence } from '../helpers/evidence';
import { abrirModulo } from '../helpers/navigation';

test.describe('Contas a Receber', () => {

  test('deve carregar o módulo Contas a Receber', async ({ page }) => {
    await abrirModulo(page, 'contasAReceber');
    await saveEvidence(page, 'contas-a-receber-carregado');
    await expect(page).not.toHaveURL(/login/i);
  });

});

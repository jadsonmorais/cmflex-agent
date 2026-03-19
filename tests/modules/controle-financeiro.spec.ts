import { test, expect } from '@playwright/test';
import { saveEvidence } from '../helpers/evidence';
import { abrirModulo } from '../helpers/navigation';

test.describe('Controle Financeiro', () => {

  test('deve carregar o módulo Controle Financeiro', async ({ page }) => {
    await abrirModulo(page, 'controleFinanceiro');
    await saveEvidence(page, 'controle-financeiro-carregado');
    await expect(page).not.toHaveURL(/login/i);
  });

});

import { test, expect } from '@playwright/test';
import { saveEvidence } from '../helpers/evidence';
import { abrirModulo } from '../helpers/navigation';

test.describe('Almoxarifado', () => {

  test('deve carregar o módulo Almoxarifado', async ({ page }) => {
    await abrirModulo(page, 'almoxarifado');
    await saveEvidence(page, 'almoxarifado-carregado');
    await expect(page).not.toHaveURL(/login/i);
  });

});

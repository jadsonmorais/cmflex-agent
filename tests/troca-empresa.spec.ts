import { test, expect } from '@playwright/test';
import { saveEvidence } from './helpers/evidence';
import { trocarEmpresa } from './helpers/navigation';

test('deve trocar de empresa com sucesso', async ({ page }) => {
  await page.goto(process.env.CMFLEX_URL!);
  await page.waitForLoadState('networkidle');

  await saveEvidence(page, 'empresa-antes');

  await trocarEmpresa(page, process.env.CMFLEX_EMPRESA_ALVO ?? 'PREENCHER');

  await saveEvidence(page, 'empresa-depois');

  await expect(page).not.toHaveURL(/login/);
});

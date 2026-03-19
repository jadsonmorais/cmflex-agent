import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

// Utilitário para salvar evidências com timestamp
async function saveEvidence(page: any, name: string) {
  const dir = 'evidencias';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '').replace('T', '_').slice(0, 15);
  const file = path.join(dir, `${timestamp}_${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`Evidência salva: ${file}`);
  return file;
}

test('validar acesso ao CMFlex', async ({ page }) => {
  await page.goto(process.env.CMFLEX_URL!);
  await page.waitForLoadState('networkidle');

  await saveEvidence(page, 'dashboard');

  // Exemplo: verifique que o dashboard carregou corretamente
  // Ajuste o seletor conforme o CMFlex
  await expect(page).not.toHaveURL(/login/);
});

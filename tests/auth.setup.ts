import { test as setup } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const sessionFile = 'auth/session.json';

setup('autenticar no CMFlex', async ({ page }) => {
  const url = process.env.CMFLEX_URL!;
  const user = process.env.CMFLEX_USER!;
  const pass = process.env.CMFLEX_PASS!;
  const empresa = process.env.CMFLEX_EMPRESA_ID ?? '1'; // CARMEL TAÍBA = value 1

  // Passo 1: Navegar para a URL principal
  await page.goto(url);
  await page.waitForLoadState('networkidle');

  // Se já está autenticado (dashboard visível), pula o login
  const onLogin = await page.locator('input[type="password"]').isVisible().catch(() => false);

  if (onLogin) {
    await page.fill('input[name="username"], input[type="text"]', user);
    await page.fill('input[name="password"], input[type="password"]', pass);
    await page.click('button[type="submit"], input[type="submit"]');

    // Passo 2: Seleção de empresa
    await page.waitForSelector('#idEmpresaSelecionada', { timeout: 15000 });
    await page.selectOption('#idEmpresaSelecionada', { value: empresa });
    await page.click('input[type="submit"][value="Logar"]');

    await page.waitForLoadState('networkidle');
  }

  // Garante que a pasta auth/ existe
  const authDir = path.dirname(sessionFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  await page.context().storageState({ path: sessionFile });
});

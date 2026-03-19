import { test } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

async function snap(page: any, name: string) {
  const dir = 'evidencias';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `discovery_${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`Screenshot: ${file}`);
}

test('discovery: dashboard e módulos', async ({ page }) => {
  await page.goto(process.env.CMFLEX_URL!);
  await page.waitForLoadState('networkidle');
  await snap(page, '03_dashboard_pag1');

  // HTML completo da página 1 do carrossel
  const html1 = await page.evaluate(() => document.documentElement.outerHTML);
  fs.writeFileSync('evidencias/discovery_03_dashboard_pag1.html', html1);
  console.log('HTML pág 1 salvo');

  // Navegar para página 2 do carrossel (seta direita)
  const btnNext = page.locator('.right, .carousel-control-next, [class*="right"], [class*="next"], [class*="arrow-right"]').first();
  if (await btnNext.isVisible()) {
    await btnNext.click();
    await page.waitForTimeout(1000);
    await snap(page, '04_dashboard_pag2');
    const html2 = await page.evaluate(() => document.documentElement.outerHTML);
    fs.writeFileSync('evidencias/discovery_04_dashboard_pag2.html', html2);
    console.log('HTML pág 2 salvo');
  }

  // Navegar para página 3 do carrossel
  if (await btnNext.isVisible()) {
    await btnNext.click();
    await page.waitForTimeout(1000);
    await snap(page, '05_dashboard_pag3');
    const html3 = await page.evaluate(() => document.documentElement.outerHTML);
    fs.writeFileSync('evidencias/discovery_05_dashboard_pag3.html', html3);
    console.log('HTML pág 3 salvo');
  }

  await page.pause();
});

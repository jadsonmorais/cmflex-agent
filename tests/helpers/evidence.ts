import * as path from 'path';
import * as fs from 'fs';

export async function saveEvidence(page: any, name: string): Promise<string> {
  const dir = 'evidencias';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '').replace('T', '_').slice(0, 15);
  const file = path.join(dir, `${timestamp}_${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`Evidência salva: ${file}`);
  return file;
}

import { Page } from '@playwright/test';

// URLs raiz-relativas dos módulos CMFlex (combinadas com baseURL do playwright.config.ts)
const MODULO_URLS = {
  almoxarifado:        '/Almoxarifado',
  compras:             '/Compras',
  contasAPagar:        '/ContasAPagar',
  contasAReceber:      '/ContasAReceber',
  controleFinanceiro:  '/ControleFinanceiro',
  contabilidade:       '/Contabilidade',
  integraBackOffice:   '/IntegraFrontOffice',  // exibido como "Integra Front Office" no sistema
  global:              '/Global',
  contratos:           '/Contrato',
  governanca:          '/Governanca',
  contratosGovernanca: '/Contrato',            // alias: usa /Contrato como entrada principal
};

export type Modulo = keyof typeof MODULO_URLS;

export async function abrirModulo(page: Page, modulo: Modulo) {
  await page.goto(MODULO_URLS[modulo], { waitUntil: 'domcontentloaded', timeout: 60000 });
}

// Troca de empresa na tela de seleção de empresa (após login)
// Usada para alternar empresa sem precisar refazer o login completo
export async function trocarEmpresa(page: Page, empresaId: string) {
  // Navega para a URL de seleção de empresa
  await page.goto('/STS/Account/LogarMultiEmpresa');
  await page.waitForSelector('#idEmpresaSelecionada', { timeout: 15000 });
  await page.selectOption('#idEmpresaSelecionada', { value: empresaId });
  await page.click('input[type="submit"][value="Logar"]');
  await page.waitForLoadState('networkidle');
}

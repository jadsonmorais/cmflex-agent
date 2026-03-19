/**
 * warmup.spec.ts
 *
 * Abre todos os módulos do CMFlex em sequência para forçar o servidor
 * a carregar o cache após a limpeza diária. Deve ser executado no início
 * de cada dia antes dos usuários acessarem o sistema.
 *
 * Execução: npx playwright test tests/warmup.spec.ts --project=cmflex
 */

import { test } from '@playwright/test';
import { saveEvidence } from './helpers/evidence';

const MODULOS = [
  { nome: 'Almoxarifado e Custos', url: '/Almoxarifado' },
  { nome: 'Compras',               url: '/Compras' },
  { nome: 'Contas a Pagar',        url: '/ContasAPagar' },
  { nome: 'Contas a Receber',      url: '/ContasAReceber' },
  { nome: 'Controle Financeiro',   url: '/ControleFinanceiro' },
  { nome: 'Contabilidade',         url: '/Contabilidade' },
  { nome: 'Integra Front Office',  url: '/IntegraFrontOffice' },
  { nome: 'Global',                url: '/Global' },
  { nome: 'Contratos',             url: '/Contrato' },
  { nome: 'Governança',            url: '/Governanca' },
];

test('warmup: acordar todos os módulos do CMFlex', async ({ page }) => {
  const resultados: { modulo: string; status: string; duracao: string }[] = [];

  for (const modulo of MODULOS) {
    const inicio = Date.now();
    let status = 'ok';

    try {
      // Navega e ignora erros de redirect/abort — o objetivo é apenas
      // disparar a requisição para o servidor carregar o cache
      await page.goto(modulo.url, { waitUntil: 'domcontentloaded', timeout: 90000 })
        .catch(() => { /* ignora ERR_ABORTED por redirect */ });

      // Aguarda o DOM estabilizar (sem esperar networkidle)
      await page.waitForTimeout(2000);
      await saveEvidence(page, `warmup_${modulo.nome.replace(/\s+/g, '-').toLowerCase()}`);
    } catch (err: any) {
      status = `erro: ${err.message?.split('\n')[0] ?? 'desconhecido'}`;
    }

    const duracao = `${((Date.now() - inicio) / 1000).toFixed(1)}s`;
    resultados.push({ modulo: modulo.nome, status, duracao });
    console.log(`[${status === 'ok' ? '✓' : '✗'}] ${modulo.nome.padEnd(25)} ${duracao}`);
  }

  // Relatório final
  console.log('\n=== RELATÓRIO DE WARMUP ===');
  const falhas = resultados.filter(r => r.status !== 'ok');
  resultados.forEach(r =>
    console.log(`  ${r.status === 'ok' ? '✅' : '❌'} ${r.modulo.padEnd(25)} ${r.duracao}  ${r.status !== 'ok' ? r.status : ''}`)
  );
  console.log(`\n  Total: ${resultados.length} módulos | OK: ${resultados.length - falhas.length} | Falhas: ${falhas.length}`);
});

const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  let browser = null;
  
  try {
    const dados = req.body;
    
    // Validar dados obrigatórios
    if (!dados.numeroProposta || !dados.nomeCliente) {
      return res.status(400).json({ error: 'Dados obrigatórios faltando' });
    }

    // Iniciar navegador
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    
    // Gerar HTML da proposta
    const html = gerarHTMLProposta(dados);
    
    // Carregar conteúdo
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Gerar PDF com alta qualidade
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    });

    await browser.close();

    // Retornar PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Proposta_${dados.numeroProposta.replace('/', '-')}.pdf"`);
    res.send(pdf);

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    if (browser) await browser.close();
    res.status(500).json({ error: 'Erro ao gerar PDF: ' + error.message });
  }
};

function gerarHTMLProposta(dados) {
  const dataFormatada = new Date(dados.dataProposta + 'T00:00:00').toLocaleDateString('pt-BR');
  
  let htmlProdutos = '';
  let totalGeral = 0;
  
  dados.produtos.forEach((prod, index) => {
    const total = prod.valorUnitario * prod.quantidade;
    totalGeral += total;
    
    let descricao = prod.nome;
    if (prod.caracteristicas) {
      descricao += '<br><br><strong>Características:</strong><br>' + prod.caracteristicas.join('<br>');
    }
    if (prod.incluso) descricao += '<br><br>' + prod.incluso;
    if (prod.origem) descricao += '<br><br>' + prod.origem;
    if (prod.registro) descricao += '<br>' + prod.registro;
    
    htmlProdutos += `
      <tr>
        <td style="text-align:center;">${String(index + 1).padStart(2, '0')}</td>
        <td style="text-align:center;">${prod.codigo}</td>
        <td>${descricao}</td>
        <td style="text-align:center;"><span style="color:#E63946;font-weight:bold;">${prod.marca}</span></td>
        <td style="text-align:center;">${prod.quantidade}</td>
        <td style="text-align:right;">R$ ${prod.valorUnitario.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</td>
        <td style="text-align:right;">R$ ${total.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</td>
      </tr>
    `;
  });
  
  const imagemProduto = dados.produtos.length > 0 && dados.produtos[0].imagem 
    ? `<img src="${dados.produtos[0].imagem}" style="width:60px;height:auto;position:absolute;right:0;top:0;">` 
    : '';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 10px; }
    .page { page-break-after: always; position: relative; padding: 15mm; min-height: 277mm; }
    .page:last-child { page-break-after: avoid; }
    .header { display: flex; align-items: center; margin-bottom: 10px; gap: 10px; }
    .logo { width: 70px; height: auto; }
    .title { flex: 1; text-align: center; font-size: 16px; font-weight: bold; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 10px 0; font-size: 9px; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; font-size: 8px; margin: 10px 0; }
    th { background-color: #FFB6C1; padding: 4px; border: 1px solid #000; font-weight: bold; text-align: center; }
    td { padding: 4px; border: 1px solid #000; vertical-align: top; }
    .total-row { font-weight: bold; text-align: right; background-color: #f0f0f0; }
    .info-section { margin: 15px 0; font-size: 8px; line-height: 1.6; position: relative; }
    .info-title { color: #E63946; font-weight: bold; font-size: 9px; margin-bottom: 5px; }
    .footer { position: absolute; bottom: 10mm; left: 15mm; right: 15mm; text-align: center; font-size: 7px; color: #E63946; line-height: 1.4; }
    .artmedical { text-align: right; margin-bottom: 5px; font-size: 7px; color: #666; }
    .artmedical img { width: 35px; height: auto; vertical-align: middle; margin-left: 5px; }
  </style>
</head>
<body>
  <!-- PÁGINA 1 -->
  <div class="page">
    <div class="header">
      <img src="https://primasalute.com.br/wp-content/uploads/2025/11/prima-salute-logo-site.png" class="logo">
      <div class="title">Proposta Comercial - Venda</div>
    </div>
    
    <div style="margin: 10px 0; font-size: 9px;">
      <strong>Proposta Nº: ${dados.numeroProposta}</strong><br>
      <strong>Data: ${dataFormatada}</strong>
    </div>
    
    <div class="info-grid">
      <div>
        <strong>Cliente:</strong><br>
        ${dados.nomeCliente || ''}<br>
        ${dados.cnpjCliente ? `<strong>CNPJ:</strong> ${dados.cnpjCliente}<br>` : ''}
        ${dados.ieCliente ? `<strong>I.Estadual:</strong> ${dados.ieCliente}` : ''}
      </div>
      <div style="text-align: right;">
        ${dados.cargoCliente ? `<strong>Cargo:</strong> ${dados.cargoCliente}<br>` : ''}
        ${dados.emailCliente ? `<strong>Email:</strong> ${dados.emailCliente}<br>` : ''}
        ${dados.telefoneCliente ? `<strong>Telefone:</strong> ${dados.telefoneCliente}` : ''}
      </div>
    </div>
    
    <table>
      <thead>
        <tr>
          <th style="width:4%;">Item</th>
          <th style="width:8%;">Código</th>
          <th style="width:38%;">Descrição</th>
          <th style="width:12%;">Marca</th>
          <th style="width:6%;">Qt.</th>
          <th style="width:16%;">Vr. Unitário</th>
          <th style="width:16%;">Vr. Total</th>
        </tr>
      </thead>
      <tbody>
        ${htmlProdutos}
      </tbody>
      <tfoot>
        <tr class="total-row">
          <td colspan="5"></td>
          <td>Sub-total:</td>
          <td>R$ ${totalGeral.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</td>
        </tr>
        <tr class="total-row">
          <td colspan="5"></td>
          <td>Frete:</td>
          <td>R$ 0,00</td>
        </tr>
        <tr class="total-row">
          <td colspan="5"></td>
          <td>Total Geral:</td>
          <td>R$ ${totalGeral.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</td>
        </tr>
      </tfoot>
    </table>
    
    <div class="info-section">
      ${imagemProduto}
      <div class="info-title">Informações adicionais:</div>
      ${dados.comercial ? `<strong>Comercial:</strong> ${dados.comercial}<br>` : ''}
      ${dados.telefoneVenda ? `<strong>Assistente Comercial:</strong> Viviane<br><strong>Telefone:</strong> ${dados.telefoneVenda}<br>` : ''}
      <br>
      <strong>Frete:</strong> ${dados.frete || 'CIF'}<br>
      <strong>Previsão de Entrega:</strong> ${dados.entrega || '90 dias'}<br>
      <strong>Prazo de pagamento:</strong> ${dados.prazoPagamento || '10 dias'}<br>
      <strong>Forma de pagamento:</strong> ${dados.pagamento || 'Dep. Bancário'}<br>
      <strong>Validade da Proposta:</strong> ${dados.validade || '30 dias'}<br>
      <strong>Transportadora:</strong> ${dados.transportadora || 'TNT Mercúrio Cargas e Encomendas Expressas Ltda.'}
    </div>
    
    <div class="artmedical">
      Importado e distribuído por:
      <img src="https://primasalute.com.br/wp-content/uploads/2026/01/Artmedical.jpg">
    </div>
    
    <div class="footer">
      Av. Paulista, 1471 - 5º Andar | Jd. Paulista | São Paulo | SP | Brasil<br>
      Tel (+55 11) 91444-2158<br>
      contato@primasalute.com.br | www.primasalute.com.br
    </div>
  </div>
  
  <!-- PÁGINA 2 -->
  <div class="page">
    <div class="header">
      <img src="https://primasalute.com.br/wp-content/uploads/2025/11/prima-salute-logo-site.png" class="logo">
      <div class="title">Proposta Comercial - Venda</div>
    </div>
    
    <div style="margin-top: 15px;">
      <div class="info-title">Endereço de Faturamento:</div>
      <div style="font-size: 9px; margin-bottom: 10px;">
        ${dados.ruaFaturamento || ''}<br>
        ${dados.bairroFaturamento ? `Bairro: ${dados.bairroFaturamento}<br>` : ''}
        ${dados.cidadeFaturamento ? `Cidade: ${dados.cidadeFaturamento}<br>` : ''}
        ${dados.estadoFaturamento ? `Estado: ${dados.estadoFaturamento}<br>` : ''}
        ${dados.cepFaturamento ? `CEP: ${dados.cepFaturamento}` : ''}
      </div>
      
      <div class="info-title">Endereço de Entrega:</div>
      <div style="font-size: 9px; margin-bottom: 10px;">
        ${dados.ruaEntrega || ''}<br>
        ${dados.bairroEntrega ? `Bairro: ${dados.bairroEntrega}<br>` : ''}
        ${dados.cidadeEntrega ? `Cidade: ${dados.cidadeEntrega}<br>` : ''}
        ${dados.estadoEntrega ? `Estado: ${dados.estadoEntrega}<br>` : ''}
        ${dados.cepEntrega ? `CEP: ${dados.cepEntrega}` : ''}
      </div>
      
      <div class="info-title">Dados Cadastrais:</div>
      <div style="font-size: 9px;">
        <strong>Razão Social:</strong> Art Medical Produtos Médico-Hospitalares Ltda.<br>
        <strong>CNPJ:</strong> 06.217.117/0001-08<br>
        <strong>Inscrição Municipal:</strong> 213.898-2-9<br>
        <strong>Inscrição Estadual:</strong> 096/3024469<br>
        <strong>Endereço:</strong> Rua Domingos Crescêncio, 394 – 2º andar – Porto Alegre/RS<br>
        <strong>Telefone/Fax:</strong> (51) 3231-3415/ (51) 3231-5741<br>
        <strong>E-mail:</strong> roger@artmedical.net<br>
        <strong>Dados Bancários:</strong> BANCO: Cod. 341 - ITAÚ UNIBANCO S.A. | AG: 9239 | CC: 29936-6
      </div>
    </div>
    
    <div class="artmedical">
      Importado e distribuído por:
      <img src="https://primasalute.com.br/wp-content/uploads/2026/01/Artmedical.jpg">
    </div>
    
    <div class="footer">
      Av. Paulista, 1471 - 5º Andar | Jd. Paulista | São Paulo | SP | Brasil<br>
      Tel (+55 11) 91444-2158<br>
      contato@primasalute.com.br | www.primasalute.com.br
    </div>
  </div>
</body>
</html>
  `;
}

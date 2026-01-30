# 🚀 Gerador de Propostas Prima Salute - Vercel

Sistema profissional de geração de propostas comerciais em PDF com **qualidade perfeita** usando Puppeteer.

## ✨ Características

- ✅ **Qualidade de imagem PERFEITA** (Puppeteer renderiza como screenshot)
- ✅ **100% GRÁTIS** no plano free do Vercel
- ✅ **PDF profissional** com 2 páginas
- ✅ **Download automático**
- ✅ **Fácil de usar** - apenas preencher e clicar

---

## 📦 Como fazer Deploy no Vercel (GRÁTIS)

### **Passo 1: Criar conta no Vercel**

1. Acesse: https://vercel.com
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"** (ou Email)
4. Crie sua conta (é grátis!)

### **Passo 2: Instalar Vercel CLI (opcional, mas recomendado)**

Abra o terminal e instale:

```bash
npm install -g vercel
```

### **Passo 3: Fazer Deploy**

#### **Opção A: Via Terminal (Mais rápido)** ⭐

1. Abra o terminal na pasta do projeto
2. Digite:

```bash
vercel login
```

3. Faça login com sua conta
4. Digite:

```bash
vercel
```

5. Responda as perguntas:
   - **Set up and deploy?** → YES
   - **Which scope?** → Sua conta
   - **Link to existing project?** → NO
   - **Project name?** → `propostas-primasalute` (ou outro nome)
   - **In which directory?** → `./` (tecle Enter)
   - **Override settings?** → NO

6. Aguarde o deploy (1-2 minutos)
7. **Pronto!** Você receberá uma URL tipo: `https://propostas-primasalute.vercel.app`

#### **Opção B: Via Dashboard do Vercel**

1. Acesse: https://vercel.com/dashboard
2. Clique em **"Add New..."** → **"Project"**
3. Clique em **"Import Git Repository"**
4. Ou use **"Deploy from template"** e faça upload dos arquivos
5. Aguarde o build
6. **Pronto!** Sua URL está disponível

---

## 📁 Estrutura dos Arquivos

```
vercel-propostas/
├── api/
│   └── gerar-pdf.js      # API serverless (Puppeteer)
├── index.html            # Formulário
├── package.json          # Dependências
├── vercel.json           # Configuração Vercel
└── README.md             # Este arquivo
```

---

## 🎯 Como Usar

1. Acesse a URL do seu deploy (ex: `https://propostas-primasalute.vercel.app`)
2. Preencha os dados do formulário
3. Clique em **"GERAR PDF PROFISSIONAL"**
4. Aguarde alguns segundos
5. **PDF baixa automaticamente** com qualidade perfeita! ✨

---

## 💰 Custos

### **Plano FREE do Vercel** (100% Grátis)
- ✅ **100 GB de banda/mês**
- ✅ **100 GB-Horas de função serverless/mês**
- ✅ **Suficiente para centenas de propostas/mês**
- ✅ **Certificado SSL grátis**
- ✅ **Deploy automático**

**Estimativa de uso:**
- Cada PDF leva ~3-5 segundos para gerar
- Média de 1-2 segundos de função serverless
- **Você pode gerar ~500-1000 propostas/mês GRÁTIS**

### **Se precisar de mais:**
- Plano Pro: $20/mês (uso ilimitado)

---

## 🔧 Troubleshooting

### **Erro: "Function exceeded timeout"**
- O Vercel free tem limite de 10s por função
- Se acontecer, faça upgrade para Pro (ou simplifique o HTML)

### **Imagens não aparecem**
- Verifique se as URLs das imagens estão acessíveis
- Certifique-se que não há bloqueio CORS

### **PDF não baixa**
- Verifique o console do navegador (F12)
- Teste com Chrome/Edge (melhor compatibilidade)

---

## 📝 Adicionar Mais Produtos

Edite o arquivo `index.html` e adicione no objeto `baseProdutos`:

```javascript
'CODIGO': {
    nome: 'NOME DO PRODUTO',
    marca: 'MARCA',
    valor: 1000.00,
    ref: 'REF. XXX',
    imagem: 'URL_DA_IMAGEM', // opcional
    caracteristicas: ['• Item 1', '• Item 2'], // opcional
    incluso: 'Texto incluso', // opcional
    origem: 'País de origem', // opcional
    registro: 'Registro ANVISA' // opcional
}
```

---

## 🎨 Personalizar Layout

Edite a função `gerarHTMLProposta()` no arquivo `api/gerar-pdf.js` para:
- Mudar cores
- Ajustar fontes
- Modificar layout
- Adicionar/remover campos

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs no Dashboard do Vercel
2. Teste localmente com `vercel dev`
3. Consulte a documentação do Vercel: https://vercel.com/docs

---

## ⚡ Deploy em Produção

Para usar em produção com domínio próprio:

1. No Dashboard do Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio
3. Configure os DNS conforme instruções
4. Pronto! Seu sistema estará em `https://seudominio.com.br`

---

**Desenvolvido para Prima Salute** 🏥✨

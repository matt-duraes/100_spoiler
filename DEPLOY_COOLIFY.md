# Deploy com Coolify na VPS

## 🎯 Visão Geral

Coolify é perfeito para sua aplicação! Você pode hospedar frontend e backend na mesma VPS.

## 📋 Pré-requisitos

- VPS com Coolify instalado
- Repositório Git (GitHub, GitLab, etc.)
- Acesso SSH à VPS (opcional, mas recomendado)

## 🚀 Passo a Passo

### 1. Preparar o Repositório

```bash
# Criar repositório no GitHub
git init
git add .
git commit -m "Deploy para Coolify"
git remote add origin https://github.com/seu-usuario/100_spoiler.git
git branch -M main
git push -u origin main
```

### 2. Configurar Backend no Coolify

#### 2.1 Criar Novo Recurso
1. Acesse o painel do Coolify
2. Clique em **"+ New Resource"**
3. Selecione **"Application"**
4. Escolha **"Public Repository"** ou conecte seu GitHub

#### 2.2 Configurar o Backend
- **Repository URL**: `https://github.com/seu-usuario/100_spoiler`
- **Branch**: `main`
- **Root Directory**: `server`
- **Build Pack**: Node.js
- **Port**: `3000`
- **Start Command**: `npm start`

#### 2.3 Variáveis de Ambiente do Backend
Adicione em **Environment Variables**:

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=cole-uma-senha-forte-aqui
ALLOWED_ORIGINS=https://seu-dominio.com
```

**Gerar JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 2.4 Deploy
- Clique em **"Deploy"**
- Aguarde o build completar
- Anote a URL do backend (ex: `https://api.seu-dominio.com`)

### 3. Configurar Frontend no Coolify

#### 3.1 Criar Novo Recurso
1. Clique em **"+ New Resource"** novamente
2. Selecione **"Application"**
3. Use o mesmo repositório

#### 3.2 Configurar o Frontend
- **Repository URL**: `https://github.com/seu-usuario/100_spoiler`
- **Branch**: `main`
- **Root Directory**: `/` (raiz do projeto)
- **Build Pack**: Node.js (Vite)
- **Build Command**: `npm run build`
- **Start Command**: Deixe vazio (Coolify serve arquivos estáticos)
- **Publish Directory**: `dist`

#### 3.3 Variáveis de Ambiente do Frontend
Adicione em **Environment Variables**:

```env
VITE_API_URL=https://api.seu-dominio.com
```
(use a URL do seu backend do passo 2.4)

#### 3.4 Deploy
- Clique em **"Deploy"**
- Aguarde o build completar

### 4. Configurar Domínios (Opcional)

#### Backend
1. No recurso do backend, vá em **"Domains"**
2. Adicione: `api.seu-dominio.com`
3. Coolify configurará SSL automaticamente

#### Frontend
1. No recurso do frontend, vá em **"Domains"**
2. Adicione: `seu-dominio.com` ou `app.seu-dominio.com`
3. SSL será configurado automaticamente

### 5. Atualizar CORS

Depois de configurar os domínios, volte ao backend e atualize `ALLOWED_ORIGINS`:

```env
ALLOWED_ORIGINS=https://seu-dominio.com,https://app.seu-dominio.com
```

Faça redeploy do backend.

## 🔄 Atualizações Automáticas

Configure **Webhooks** para deploy automático:

1. No Coolify, vá em **Settings** do recurso
2. Copie a **Webhook URL**
3. No GitHub:
   - Vá em Settings → Webhooks
   - Adicione a URL do Coolify
   - Selecione eventos: `push`

Agora, cada `git push` fará deploy automático!

## 📊 Banco de Dados

Sua aplicação usa SQLite, que funciona perfeitamente no Coolify. O arquivo `database.sqlite` será persistido automaticamente.

**Importante**: Configure um volume persistente no Coolify:
1. Vá em **Storage** do recurso backend
2. Adicione volume: `/app/server/database.sqlite`

## 🔍 Logs e Monitoramento

- **Logs**: Acesse em **Logs** no painel do Coolify
- **Status**: Monitore em **Deployments**
- **Recursos**: Veja uso de CPU/RAM em **Metrics**

## 💡 Dicas

### Otimização de Build
Se o build estiver lento, adicione ao `package.json` do frontend:

```json
"scripts": {
  "build": "vite build --mode production"
}
```

### Backup do Banco de Dados
Configure backup automático do SQLite:

```bash
# SSH na VPS
ssh usuario@sua-vps

# Criar script de backup
crontab -e

# Adicionar linha (backup diário às 3h):
0 3 * * * cp /caminho/para/database.sqlite /caminho/backup/database-$(date +\%Y\%m\%d).sqlite
```

### Health Checks
Coolify faz health checks automaticamente. Certifique-se que o backend responde em `/` ou configure uma rota de health:

```javascript
// Adicionar em server/index.js
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
```

## 🎉 Pronto!

Sua aplicação está no ar! Acesse pelo domínio configurado.

## 🆘 Troubleshooting

### Build falha
- Verifique os logs no Coolify
- Confirme que `npm install` funciona localmente
- Verifique versão do Node.js (use Node 18+)

### Frontend não conecta ao backend
- Verifique `VITE_API_URL` no frontend
- Verifique `ALLOWED_ORIGINS` no backend
- Teste a URL do backend diretamente no navegador

### Banco de dados não persiste
- Configure volume persistente (passo 6)
- Verifique permissões de escrita

## 📚 Recursos

- [Documentação Coolify](https://coolify.io/docs)
- [Troubleshooting Coolify](https://coolify.io/docs/knowledge-base/troubleshooting)

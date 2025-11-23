# Deploy com Docker Compose no Coolify

## 🎯 Visão Geral

Sua aplicação agora usa **1 único Dockerfile** que roda frontend + backend juntos em um container usando Supervisor.

## 📋 Pré-requisitos

- ✅ Código no GitHub
- ✅ Coolify instalado na VPS
- ✅ Acesso ao painel do Coolify

## 🚀 Passo a Passo no Coolify

### 1. Criar Novo Recurso

1. No Coolify, clique em **"+ New Resource"**
2. Escolha **"Docker Compose Empty"**

### 2. Configuração Geral

Preencha os campos conforme a imagem:

#### **Name** (Nome)
```
100spoiler
```

#### **Description** (Descrição - opcional)
```
Sistema de biblioteca de livros com spoilers
```

#### **Domains** (Domínios)
```
http://100spoiler.dev
```
ou use seu domínio personalizado

#### **Direction**
```
Allow www & non-www
```

### 3. Build Configuration

#### **Base Directory**
```
/
```
(raiz do projeto - deixe apenas `/`)

#### **Docker Build Stage Target**
Deixe **vazio**

#### **Custom Docker Options**
Deixe **vazio** (ou use o padrão)

#### **Use a Build Server?**
Deixe **desmarcado**

### 4. Docker Compose

No campo **"Docker Compose file"**, cole o conteúdo do seu `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - VITE_API_URL=${VITE_API_URL:-http://localhost:3000}
    container_name: 100spoiler-app
    restart: unless-stopped
    expose:
      - "80"
      - "3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - JWT_SECRET=${JWT_SECRET}
      - ALLOWED_ORIGINS=${ALLOWED_ORIGINS:-*}
    volumes:
      - sqlite-data:/app/server
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  sqlite-data:
```

### 5. Environment Variables

Vá em **"Environment Variables"** (menu lateral) e adicione:

```env
JWT_SECRET=cole-aqui-senha-forte-gerada
ALLOWED_ORIGINS=http://100spoiler.dev
VITE_API_URL=http://localhost:3000
```

**Para gerar JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 6. Source (Conectar ao GitHub)

1. Vá em **"Source"** no menu lateral
2. Conecte ao GitHub
3. Selecione o repositório: `matt-duraes/100_spoiler`
4. Branch: `main`

### 7. Deploy

1. Clique em **"Save"**
2. Clique em **"Deploy"**
3. Aguarde o build completar (pode levar alguns minutos)

## 🌐 Configurar Domínio (Opcional)

### Depois do Deploy

1. Vá em **"Domains"** no menu lateral
2. Adicione seu domínio: `100spoiler.dev` ou `seu-dominio.com`
3. Coolify configurará SSL automaticamente

### Atualizar CORS

Depois de configurar o domínio, atualize a variável `ALLOWED_ORIGINS`:

```env
ALLOWED_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com
```

E faça **redeploy**.

## 📊 Verificar se Funcionou

### Logs
1. Vá em **"Logs"** no menu lateral
2. Procure por:
   ```
   Database synced
   Server running on http://localhost:3000
   ```

### Healthcheck
1. Vá em **"Healthcheck"** no menu lateral
2. Deve mostrar status **"healthy"**

### Acessar
- Abra o domínio configurado no navegador
- Deve carregar a aplicação! 🎉

## 🔄 Atualizações Automáticas

### Configurar Webhook

1. Vá em **"Webhooks"** no menu lateral
2. Copie a **Webhook URL**
3. No GitHub:
   - Settings → Webhooks → Add webhook
   - Cole a URL do Coolify
   - Selecione eventos: `push`
   - Save

Agora cada `git push` fará deploy automático! 🚀

## 🔧 Troubleshooting

### Build falha
- Verifique os logs em **"Logs"**
- Confirme que as variáveis de ambiente estão corretas
- Tente **"Force Rebuild"**

### 404 ao acessar
- Verifique se o container está rodando em **"Metrics"**
- Verifique os logs do Nginx
- Confirme que a porta 80 está exposta

### Backend não conecta
- Verifique `VITE_API_URL` nas variáveis de ambiente
- Verifique `ALLOWED_ORIGINS` no backend
- Teste: `curl http://seu-dominio.com:3000/health`

### Banco de dados não persiste
- Verifique em **"Persistent Storage"** se o volume está configurado
- O volume `sqlite-data` deve estar montado em `/app/server`

## 💡 Dicas

### Ver recursos utilizados
- Vá em **"Metrics"** para ver CPU/RAM/Disco

### Rollback
- Vá em **"Preview Deployments"** para voltar versões anteriores

### Scheduled Tasks
- Configure backups automáticos em **"Scheduled Tasks"**

### Resource Limits
- Configure limites de CPU/RAM em **"Resource Limits"**

## 🎉 Pronto!

Sua aplicação está no ar com:
- ✅ Frontend servido pelo Nginx (porta 80)
- ✅ Backend rodando no Node.js (porta 3000)
- ✅ Banco de dados SQLite persistente
- ✅ SSL automático (se configurou domínio)
- ✅ Deploy automático via webhook

## 📚 Próximos Passos

1. Configure um domínio personalizado
2. Configure webhook para deploy automático
3. Configure backup do banco de dados
4. Monitore recursos em **"Metrics"**

---

**Dúvidas?** Verifique os logs em **"Logs"** ou teste localmente com:
```bash
docker-compose up
```

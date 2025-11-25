# 🚀 Deploy no Coolify - 100spoiler

Este guia mostra como fazer deploy da aplicação 100spoiler no Coolify.

## 📋 Pré-requisitos

- [ ] VPS com Coolify instalado e configurado
- [ ] Repositório Git (GitHub, GitLab, etc.) com o código
- [ ] Domínio configurado (opcional, mas recomendado)

## 🏗️ Arquitetura

A aplicação consiste em 3 serviços:
- **Frontend**: React + Vite servido via Nginx
- **Backend**: Node.js + Express + Prisma
- **Database**: PostgreSQL 15

## 🔧 Opções de Deploy no Coolify

### Opção 1: Docker Compose (Recomendado)

Esta é a forma mais simples - um único projeto com todos os serviços.

#### Passo 1: Preparar o Repositório

1. Certifique-se de que todos os arquivos de produção estão commitados:
```bash
git add .
git commit -m "Add production configurations"
git push origin main
```

#### Passo 2: Criar Projeto no Coolify

1. Acesse seu Coolify
2. Clique em **"+ New Resource"**
3. Selecione **"Docker Compose"**
4. Configure:
   - **Name**: `100spoiler`
   - **Git Repository**: Cole a URL do seu repositório
   - **Branch**: `main` (ou sua branch principal)
   - **Docker Compose Location**: `docker-compose.prod.yml`

#### Passo 3: Configurar Variáveis de Ambiente

No Coolify, vá em **Environment Variables** e adicione:

```bash
# Geral
NODE_ENV=production

# Backend
SERVER_PORT=3000
JWT_SECRET=seu-secret-super-seguro-aqui-min-32-caracteres
ALLOWED_ORIGINS=https://seudominio.com,https://www.seudominio.com

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua-senha-super-segura-aqui
POSTGRES_DB=spoilerdb
DATABASE_URL=postgresql://postgres:sua-senha-super-segura-aqui@postgres:5432/spoilerdb

# Frontend (build time)
VITE_API_URL=https://api.seudominio.com
```

> [!IMPORTANT]
> **JWT_SECRET**: Gere uma chave segura com: `openssl rand -base64 32`
> 
> **POSTGRES_PASSWORD**: Use uma senha forte e única

#### Passo 4: Configurar Domínios

1. No Coolify, vá em **Domains**
2. Adicione seus domínios:
   - Frontend: `seudominio.com` → porta `80` (serviço `web`)
   - Backend: `api.seudominio.com` → porta `3000` (serviço `server`)
3. Ative **SSL/TLS** (Let's Encrypt automático)

#### Passo 5: Deploy

1. Clique em **"Deploy"**
2. Aguarde o build e deploy (pode levar alguns minutos)
3. Monitore os logs em tempo real

#### Passo 6: Verificar

Acesse:
- Frontend: `https://seudominio.com`
- Backend Health: `https://api.seudominio.com/health`

---

### Opção 2: Serviços Separados

Se preferir gerenciar cada serviço separadamente no Coolify:

#### 2.1 PostgreSQL

1. **"+ New Resource"** → **"Database"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `100spoiler-db`
   - **Version**: `15-alpine`
   - **Database**: `spoilerdb`
   - **Username**: `postgres`
   - **Password**: (gere uma senha forte)
3. Anote a **Internal URL** (ex: `postgresql://postgres:password@100spoiler-db:5432/spoilerdb`)

#### 2.2 Backend

1. **"+ New Resource"** → **"Application"**
2. Configure:
   - **Name**: `100spoiler-backend`
   - **Git Repository**: URL do repositório
   - **Branch**: `main`
   - **Base Directory**: `server`
   - **Dockerfile**: `Dockerfile.prod`
   - **Port**: `3000`

3. **Environment Variables**:
```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=seu-secret-aqui
DATABASE_URL=postgresql://postgres:password@100spoiler-db:5432/spoilerdb
ALLOWED_ORIGINS=https://seudominio.com
```

4. **Domain**: `api.seudominio.com`
5. **Deploy**

#### 2.3 Frontend

1. **"+ New Resource"** → **"Application"**
2. Configure:
   - **Name**: `100spoiler-frontend`
   - **Git Repository**: URL do repositório
   - **Branch**: `main`
   - **Base Directory**: `/` (raiz)
   - **Dockerfile**: `Dockerfile.prod`
   - **Port**: `80`

3. **Build Arguments** (importante!):
```bash
VITE_API_URL=https://api.seudominio.com
```

4. **Domain**: `seudominio.com`
5. **Deploy**

---

## 🔄 Atualizações e Redeploy

### Deploy Automático (Recomendado)

1. No Coolify, ative **"Auto Deploy"** nas configurações do projeto
2. Configure o webhook no GitHub/GitLab
3. Cada push na branch principal fará deploy automático

### Deploy Manual

1. Acesse o projeto no Coolify
2. Clique em **"Redeploy"**
3. Aguarde o processo completar

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"

**Solução**:
- Verifique se `DATABASE_URL` está correta
- Confirme que o serviço PostgreSQL está rodando
- Se usando serviços separados, use o nome interno do container (ex: `100spoiler-db`)

### Erro: "CORS policy"

**Solução**:
- Verifique `ALLOWED_ORIGINS` no backend
- Deve incluir o domínio do frontend (ex: `https://seudominio.com`)
- Não use `*` em produção

### Frontend não carrega dados

**Solução**:
- Verifique se `VITE_API_URL` foi configurado corretamente no build
- Teste o endpoint: `curl https://api.seudominio.com/health`
- Verifique os logs do backend no Coolify

### Migrations não rodaram

**Solução**:
- O `docker-compose.prod.yml` já roda migrations automaticamente
- Se necessário, execute manualmente:
```bash
# No Coolify, vá em Terminal do serviço server
npx prisma migrate deploy
```

### Erro 502 Bad Gateway

**Solução**:
- Verifique se os serviços estão rodando (Coolify → Containers)
- Confirme que as portas estão corretas
- Verifique os logs de cada serviço

---

## 📊 Monitoramento

No Coolify você pode:
- Ver logs em tempo real de cada serviço
- Monitorar uso de CPU/RAM
- Configurar alertas
- Ver histórico de deploys

---

## 🔐 Segurança

### Checklist de Segurança

- [ ] `JWT_SECRET` é forte e único (min 32 caracteres)
- [ ] `POSTGRES_PASSWORD` é forte e único
- [ ] SSL/TLS ativado (HTTPS)
- [ ] `ALLOWED_ORIGINS` configurado corretamente (não usar `*`)
- [ ] `NODE_ENV=production`
- [ ] Secrets não estão no código (usar env vars)
- [ ] Firewall configurado no VPS (apenas portas 80, 443, 22)

---

## 📝 Comandos Úteis

### Ver logs do backend
```bash
# No terminal do Coolify (serviço server)
npm start
```

### Rodar migrations manualmente
```bash
# No terminal do Coolify (serviço server)
npx prisma migrate deploy
```

### Resetar banco de dados (CUIDADO!)
```bash
# No terminal do Coolify (serviço server)
npx prisma migrate reset
```

### Gerar novo Prisma Client
```bash
# No terminal do Coolify (serviço server)
npx prisma generate
```

---

## 🎯 Próximos Passos

Após o deploy:

1. **Teste completo**:
   - Registrar novo usuário
   - Fazer login
   - Adicionar livros
   - Adicionar amigos
   - Ver livros de amigos

2. **Configure backups**:
   - Coolify tem backup automático do PostgreSQL
   - Configure frequência e retenção

3. **Monitore**:
   - Configure alertas de uptime
   - Use ferramentas como UptimeRobot

4. **Performance**:
   - Configure CDN se necessário (Cloudflare)
   - Monitore tempos de resposta

---

## 💡 Dicas

- Use **Auto Deploy** para CI/CD automático
- Configure **Health Checks** para restart automático
- Use **Volumes** para persistência de dados do PostgreSQL
- Configure **Resource Limits** para evitar sobrecarga
- Mantenha **backups regulares** do banco de dados

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no Coolify
2. Consulte a documentação do Coolify: https://coolify.io/docs
3. Verifique as issues do projeto no GitHub

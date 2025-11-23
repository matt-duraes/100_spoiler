# Deploy com Docker no Coolify

## 🐳 Visão Geral

Sua aplicação agora está **100% dockerizada**! Tudo em um único `docker-compose.yml`.

## 📦 O que foi criado

- ✅ `server/Dockerfile` - Imagem do backend
- ✅ `Dockerfile` - Imagem do frontend (multi-stage build)
- ✅ `nginx.conf` - Configuração do Nginx para SPA
- ✅ `docker-compose.yml` - Orquestração completa
- ✅ `.env.docker` - Template de variáveis de ambiente

## 🚀 Deploy no Coolify

### Opção 1: Docker Compose (Recomendado - Mais Simples)

#### 1. Push para GitHub
```bash
git add .
git commit -m "Adicionar Docker setup"
git push
```

#### 2. No Coolify
1. Clique em **"+ New Resource"**
2. Selecione **"Docker Compose"**
3. Conecte seu repositório GitHub
4. Configure:
   - **Repository**: `seu-usuario/100_spoiler`
   - **Branch**: `main`
   - **Docker Compose Location**: `docker-compose.yml` (raiz)

#### 3. Variáveis de Ambiente
Adicione em **Environment Variables**:

```env
JWT_SECRET=cole-senha-forte-aqui
ALLOWED_ORIGINS=https://seu-dominio.com
VITE_API_URL=https://api.seu-dominio.com
```

**Gerar JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 4. Deploy
- Clique em **"Deploy"**
- Coolify vai:
  - Buildar as imagens
  - Subir os containers
  - Configurar networking
  - Persistir o banco de dados

#### 5. Configurar Domínios
- **Frontend**: `seu-dominio.com` → porta `80`
- **Backend**: `api.seu-dominio.com` → porta `3000`

### Opção 2: Duas Aplicações Separadas

Se preferir mais controle, pode criar 2 aplicações no Coolify:

#### Backend
1. **Build Pack**: Docker
2. **Dockerfile Location**: `server/Dockerfile`
3. **Port**: `3000`

#### Frontend
1. **Build Pack**: Docker
2. **Dockerfile Location**: `Dockerfile`
3. **Port**: `80`

## 🧪 Testar Localmente

### 1. Criar arquivo .env
```bash
cp .env.docker .env
```

Edite `.env` e adicione suas variáveis.

### 2. Rodar com Docker Compose
```bash
# Build e start
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Rebuild após mudanças
docker-compose up -d --build
```

### 3. Acessar
- Frontend: http://localhost
- Backend: http://localhost:3000

## 📊 Persistência de Dados

O banco de dados SQLite é persistido em:
- Volume: `./server/database.sqlite`
- Mesmo após reiniciar containers, os dados permanecem

## 🔄 Atualizações

### Deploy Automático no Coolify
1. Configure webhook no GitHub
2. Cada `git push` faz rebuild e redeploy automático

### Atualização Manual
```bash
# Na VPS com Coolify
docker-compose pull
docker-compose up -d --build
```

## 🎯 Vantagens do Docker

✅ **Portabilidade** - Roda em qualquer lugar
✅ **Isolamento** - Cada serviço em seu container
✅ **Fácil rollback** - Voltar para versão anterior
✅ **Escalabilidade** - Fácil adicionar réplicas
✅ **Consistência** - Mesmo ambiente dev/prod

## 🔍 Monitoramento

### Ver logs
```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend
```

### Status dos containers
```bash
docker-compose ps
```

### Recursos utilizados
```bash
docker stats
```

## 🆘 Troubleshooting

### Build falha
```bash
# Limpar cache e rebuildar
docker-compose build --no-cache
docker-compose up -d
```

### Banco de dados não persiste
Verifique se o volume está configurado:
```bash
docker volume ls
docker volume inspect 100_spoiler_db-data
```

### Frontend não conecta ao backend
1. Verifique `VITE_API_URL` no build
2. Verifique `ALLOWED_ORIGINS` no backend
3. Teste: `curl http://localhost:3000/health`

### Porta já em uso
Altere as portas no `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Frontend na porta 8080
  - "3001:3000"  # Backend na porta 3001
```

## 🔒 Segurança

### Boas práticas implementadas:
- ✅ Multi-stage build (imagem menor)
- ✅ Node Alpine (imagem leve e segura)
- ✅ Nginx com headers de segurança
- ✅ Health checks configurados
- ✅ Restart automático
- ✅ Network isolada

## 📈 Otimizações

### Reduzir tamanho das imagens
Já implementado com:
- Alpine Linux (base mínima)
- Multi-stage build
- `npm ci --only=production`

### Cache de build
Docker usa cache de layers automaticamente.

## 🎉 Pronto!

Sua aplicação está completamente dockerizada e pronta para deploy no Coolify!

**Próximos passos:**
1. Teste localmente com `docker-compose up`
2. Push para GitHub
3. Configure no Coolify como "Docker Compose"
4. Deploy! 🚀

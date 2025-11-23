# 🚀 Guia Rápido de Deploy

## ✅ O que já está pronto

Sua aplicação está **100% preparada para produção**! Aqui está o que foi feito:

### Frontend
- ✅ Configuração centralizada de API (`src/config/api.js`)
- ✅ Todos os componentes usando variáveis de ambiente
- ✅ Build testado e funcionando
- ✅ Arquivo `.env.example` criado

### Backend
- ✅ CORS configurável por variável de ambiente
- ✅ Scripts `start` e `dev` adicionados
- ✅ Arquivo `.env.example` criado
- ✅ Segurança configurada (Helmet, Rate Limiting)

## 📝 Próximos Passos

### 1. Criar Repositório no GitHub

```bash
# Se ainda não tem git inicializado
git init
git add .
git commit -m "Aplicação pronta para produção"

# Criar repositório no GitHub e fazer push
git remote add origin https://github.com/seu-usuario/100_spoiler.git
git branch -M main
git push -u origin main
```

### 2. Deploy do Backend (Railway - RECOMENDADO)

1. Acesse [railway.app](https://railway.app) e faça login com GitHub
2. Clique em "New Project" → "Deploy from GitHub repo"
3. Selecione o repositório `100_spoiler`
4. Configure:
   - **Root Directory**: `server`
   - **Start Command**: `npm start`
5. Adicione as variáveis de ambiente em Settings → Variables:
   ```
   JWT_SECRET=cole-uma-senha-forte-aleatoria-aqui
   PORT=3000
   NODE_ENV=production
   ALLOWED_ORIGINS=https://seu-app.vercel.app
   ```
6. Copie a URL do backend (ex: `https://100spoiler.up.railway.app`)

### 3. Deploy do Frontend (Vercel - RECOMENDADO)

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em "Add New" → "Project"
3. Selecione o repositório `100_spoiler`
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: deixe em branco
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Adicione a variável de ambiente:
   ```
   VITE_API_URL=https://100spoiler.up.railway.app
   ```
   (use a URL do seu backend Railway)
6. Clique em "Deploy"

### 4. Atualizar CORS no Backend

Depois que o frontend estiver no ar, volte ao Railway e atualize a variável `ALLOWED_ORIGINS`:

```
ALLOWED_ORIGINS=https://seu-app.vercel.app,https://seu-app-preview.vercel.app
```

## 🔒 Segurança

**IMPORTANTE**: Antes de fazer o deploy, gere uma senha forte para `JWT_SECRET`:

```bash
# No terminal, rode:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use o resultado como valor de `JWT_SECRET` no Railway.

## 💰 Custos

- **Vercel (Frontend)**: Gratuito
- **Railway (Backend)**: $5/mês de crédito gratuito
- **Total**: Gratuito para começar!

## 🎉 Pronto!

Sua aplicação estará no ar em poucos minutos. Acesse a URL do Vercel e teste!

## 📚 Documentação Completa

Para mais detalhes, veja o arquivo `DEPLOY.md` na raiz do projeto.

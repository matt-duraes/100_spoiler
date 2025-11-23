# Guia de Deploy para Produção

## 📋 Visão Geral

Sua aplicação tem duas partes:
- **Frontend (React + Vite)**: Interface do usuário
- **Backend (Node.js + Express)**: API e banco de dados

## 🚀 Opções de Hospedagem Recomendadas

### Opção 1: Vercel + Railway (Recomendado - Mais Fácil)

#### **Frontend no Vercel** (Gratuito)
- ✅ Deploy automático do GitHub
- ✅ HTTPS gratuito
- ✅ CDN global
- ✅ Domínio gratuito (.vercel.app)

#### **Backend no Railway** (Gratuito até $5/mês de uso)
- ✅ Deploy automático do GitHub
- ✅ Banco de dados SQLite persistente
- ✅ HTTPS gratuito
- ✅ Fácil configuração

### Opção 2: Render (Tudo em um lugar)

#### **Frontend + Backend no Render** (Gratuito com limitações)
- ✅ Tudo em um lugar
- ✅ HTTPS gratuito
- ⚠️ Pode "dormir" após inatividade (plano gratuito)

### Opção 3: VPS (DigitalOcean, Linode, etc.)
- Mais controle, mas requer mais conhecimento técnico
- Custo: ~$5-10/mês

## 📝 Preparação da Aplicação

### 1. Variáveis de Ambiente

Você precisa criar arquivos `.env` para produção:

**Backend (.env)**
```env
PORT=3000
JWT_SECRET=sua-chave-secreta-super-segura-aqui
NODE_ENV=production
```

**Frontend (.env.production)**
```env
VITE_API_URL=https://seu-backend.railway.app
```

### 2. Ajustes no Código

Precisamos fazer alguns ajustes para produção.

## 🔧 Passos para Deploy (Vercel + Railway)

### Passo 1: Preparar o Repositório Git

```bash
# Se ainda não tem git inicializado
git init
git add .
git commit -m "Preparando para produção"

# Criar repositório no GitHub e fazer push
git remote add origin https://github.com/seu-usuario/100_spoiler.git
git branch -M main
git push -u origin main
```

### Passo 2: Deploy do Backend (Railway)

1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project" → "Deploy from GitHub repo"
4. Selecione o repositório `100_spoiler`
5. Configure:
   - **Root Directory**: `server`
   - **Start Command**: `node index.js`
6. Adicione as variáveis de ambiente (Settings → Variables):
   - `JWT_SECRET`: uma string aleatória segura
   - `PORT`: 3000
   - `NODE_ENV`: production
7. Copie a URL do seu backend (ex: `https://100spoiler.up.railway.app`)

### Passo 3: Deploy do Frontend (Vercel)

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em "Add New" → "Project"
4. Selecione o repositório `100_spoiler`
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: deixe em branco (raiz do projeto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Adicione a variável de ambiente:
   - `VITE_API_URL`: a URL do seu backend Railway
7. Clique em "Deploy"

### Passo 4: Atualizar o Frontend para usar a variável de ambiente

Você precisa atualizar os arquivos que fazem chamadas à API.

## 📦 Checklist Pré-Deploy

- [ ] Criar `.gitignore` adequado
- [ ] Adicionar variáveis de ambiente
- [ ] Atualizar URLs da API no frontend
- [ ] Testar build local
- [ ] Configurar CORS no backend para aceitar o domínio do frontend
- [ ] Criar repositório no GitHub
- [ ] Fazer deploy do backend
- [ ] Fazer deploy do frontend
- [ ] Testar a aplicação em produção

## 🔒 Segurança

1. **Nunca commite** arquivos `.env` no Git
2. Use senhas fortes para `JWT_SECRET`
3. Configure CORS corretamente (não deixe `*` em produção)
4. Use HTTPS sempre (Vercel e Railway já fornecem)

## 💰 Custos Estimados

- **Vercel (Frontend)**: Gratuito
- **Railway (Backend)**: Gratuito até $5/mês de uso
- **Total**: $0-5/mês para começar

## 🆘 Suporte

Se tiver problemas:
1. Verifique os logs no painel do Railway/Vercel
2. Confirme que as variáveis de ambiente estão corretas
3. Teste localmente primeiro com `npm run build` e `npm run preview`

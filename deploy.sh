#!/bin/bash

# Script de Deploy Automático para Coolify
# Autor: Antigravity AI
# Data: 2025-11-23

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções de log
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║   🚀 Deploy Automático - Coolify     ║"
echo "║   100 Spoiler - Book Library         ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Verificar se está no diretório correto
if [ ! -f "docker-compose.yml" ]; then
    log_error "Arquivo docker-compose.yml não encontrado!"
    log_error "Execute este script na raiz do projeto."
    exit 1
fi

log_success "Diretório correto detectado"

# Verificar se Git está configurado
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    log_error "Este não é um repositório Git!"
    exit 1
fi

log_success "Repositório Git detectado"

# Verificar se há mudanças não commitadas
if ! git diff-index --quiet HEAD --; then
    log_warning "Há mudanças não commitadas"
    read -p "Deseja commitar as mudanças? (s/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        log_info "Adicionando arquivos ao Git..."
        git add -A
        
        read -p "Mensagem do commit: " commit_msg
        if [ -z "$commit_msg" ]; then
            commit_msg="Deploy automático $(date '+%Y-%m-%d %H:%M:%S')"
        fi
        
        git commit -m "$commit_msg"
        log_success "Commit realizado"
    fi
fi

# Fazer push para o repositório remoto
log_info "Fazendo push para o GitHub..."
if git push origin main; then
    log_success "Push realizado com sucesso"
else
    log_error "Falha ao fazer push"
    exit 1
fi

# Verificar variáveis de ambiente
log_info "Verificando variáveis de ambiente..."

if [ ! -f ".env" ]; then
    log_warning "Arquivo .env não encontrado"
    log_info "Criando .env a partir de .env.docker..."
    
    if [ -f ".env.docker" ]; then
        cp .env.docker .env
        log_warning "IMPORTANTE: Edite o arquivo .env e adicione valores reais!"
        log_warning "Especialmente: JWT_SECRET, ALLOWED_ORIGINS, VITE_API_URL"
        
        read -p "Pressione ENTER para continuar após editar o .env..."
    else
        log_error "Arquivo .env.docker também não encontrado!"
        exit 1
    fi
fi

# Gerar JWT_SECRET se necessário
if grep -q "sua-senha-forte" .env 2>/dev/null; then
    log_warning "JWT_SECRET não configurado!"
    log_info "Gerando JWT_SECRET seguro..."
    
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    
    # Substituir no .env
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/sua-senha-forte.*/$JWT_SECRET/" .env
    else
        sed -i "s/sua-senha-forte.*/$JWT_SECRET/" .env
    fi
    
    log_success "JWT_SECRET gerado e salvo no .env"
fi

# Testar build local (opcional)
log_info "Deseja testar o build localmente antes do deploy?"
read -p "(s/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Ss]$ ]]; then
    log_info "Testando build do Docker..."
    
    if docker-compose build; then
        log_success "Build local bem-sucedido!"
        
        log_info "Deseja subir os containers localmente para testar?"
        read -p "(s/n): " -n 1 -r
        echo
        
        if [[ $REPLY =~ ^[Ss]$ ]]; then
            log_info "Subindo containers..."
            docker-compose up -d
            
            log_success "Containers rodando!"
            log_info "Frontend: http://localhost"
            log_info "Backend: http://localhost:3000"
            log_info ""
            log_warning "Pressione ENTER quando terminar de testar..."
            read
            
            log_info "Parando containers..."
            docker-compose down
        fi
    else
        log_error "Build falhou! Corrija os erros antes de fazer deploy."
        exit 1
    fi
fi

# Informações para o Coolify
echo ""
log_success "Código pronto para deploy no Coolify!"
echo ""
log_info "═══════════════════════════════════════"
log_info "📋 PRÓXIMOS PASSOS NO COOLIFY:"
log_info "═══════════════════════════════════════"
echo ""
echo "1. Acesse o painel do Coolify"
echo "2. Vá no seu serviço '100spoiler'"
echo "3. Clique em 'Force Rebuild' ou 'Redeploy'"
echo "4. Aguarde o build completar (2-3 minutos)"
echo ""
log_info "═══════════════════════════════════════"
log_info "⚙️  VARIÁVEIS DE AMBIENTE NO COOLIFY:"
log_info "═══════════════════════════════════════"
echo ""

# Ler e mostrar variáveis do .env
if [ -f ".env" ]; then
    echo "Copie estas variáveis para o Coolify:"
    echo ""
    cat .env | grep -v '^#' | grep -v '^$'
    echo ""
fi

log_info "═══════════════════════════════════════"
log_info "🔗 URLs APÓS DEPLOY:"
log_info "═══════════════════════════════════════"
echo ""
echo "Frontend: http://seu-dominio.com"
echo "Backend API: http://seu-dominio.com:3000"
echo "Health Check: http://seu-dominio.com:3000/health"
echo ""

log_success "Script concluído com sucesso! 🎉"
log_info "Agora é só fazer o deploy no Coolify!"
echo ""

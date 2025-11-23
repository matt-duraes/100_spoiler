# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código
COPY . .

# Criar diretório para o banco de dados
RUN mkdir -p /app/data

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["node", "index.js"]

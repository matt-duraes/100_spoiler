# Multi-stage build otimizado
FROM node:18-alpine AS base

# Stage 1: Build Frontend
FROM base AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src ./src
COPY index.html ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Prepare Backend
FROM base AS backend-builder
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production

# Stage 3: Final image
FROM node:18-alpine
WORKDIR /app

# Instalar nginx e supervisor
RUN apk add --no-cache nginx supervisor

# Copiar backend
COPY --from=backend-builder /app/node_modules ./node_modules
COPY server ./

# Copiar frontend buildado
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Configurar nginx
COPY nginx.conf /etc/nginx/http.d/default.conf

# Criar configuração do supervisor
RUN printf '[supervisord]\n\
nodaemon=true\n\
\n\
[program:backend]\n\
command=node index.js\n\
directory=/app\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n\
\n\
[program:nginx]\n\
command=nginx -g "daemon off;"\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n' > /etc/supervisord.conf

EXPOSE 80 3000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]

# Dockerfile único para toda a aplicação (Frontend + Backend)
FROM node:18-alpine

WORKDIR /app

# Instalar nginx para servir o frontend
RUN apk add --no-cache nginx supervisor

# Copiar código do backend
COPY server ./server
WORKDIR /app/server
RUN npm ci --only=production

# Copiar código do frontend
WORKDIR /app
COPY package*.json ./
COPY src ./src
COPY public ./public
COPY index.html ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Build do frontend
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL
RUN npm ci && npm run build

# Configurar nginx
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copiar arquivos buildados para nginx
RUN cp -r /app/dist/* /usr/share/nginx/html/

# Criar diretório para logs
RUN mkdir -p /var/log/supervisor

# Configuração do supervisor para rodar nginx + node
RUN echo "[supervisord]" > /etc/supervisord.conf && \
    echo "nodaemon=true" >> /etc/supervisord.conf && \
    echo "" >> /etc/supervisord.conf && \
    echo "[program:backend]" >> /etc/supervisord.conf && \
    echo "command=node /app/server/index.js" >> /etc/supervisord.conf && \
    echo "directory=/app/server" >> /etc/supervisord.conf && \
    echo "autostart=true" >> /etc/supervisord.conf && \
    echo "autorestart=true" >> /etc/supervisord.conf && \
    echo "stdout_logfile=/dev/stdout" >> /etc/supervisord.conf && \
    echo "stdout_logfile_maxbytes=0" >> /etc/supervisord.conf && \
    echo "stderr_logfile=/dev/stderr" >> /etc/supervisord.conf && \
    echo "stderr_logfile_maxbytes=0" >> /etc/supervisord.conf && \
    echo "" >> /etc/supervisord.conf && \
    echo "[program:nginx]" >> /etc/supervisord.conf && \
    echo "command=nginx -g 'daemon off;'" >> /etc/supervisord.conf && \
    echo "autostart=true" >> /etc/supervisord.conf && \
    echo "autorestart=true" >> /etc/supervisord.conf && \
    echo "stdout_logfile=/dev/stdout" >> /etc/supervisord.conf && \
    echo "stdout_logfile_maxbytes=0" >> /etc/supervisord.conf && \
    echo "stderr_logfile=/dev/stderr" >> /etc/supervisord.conf && \
    echo "stderr_logfile_maxbytes=0" >> /etc/supervisord.conf

# Expor portas
EXPOSE 80 3000

# Iniciar supervisor (roda nginx + backend)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]

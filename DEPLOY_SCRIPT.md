# 🚀 Como Usar o Script de Deploy

## Uso Rápido

```bash
./deploy.sh
```

## O que o script faz:

1. ✅ **Verifica** se está no diretório correto
2. ✅ **Commita** mudanças pendentes (se houver)
3. ✅ **Faz push** para o GitHub
4. ✅ **Gera JWT_SECRET** seguro automaticamente
5. ✅ **Testa build** localmente (opcional)
6. ✅ **Mostra** variáveis de ambiente para copiar
7. ✅ **Guia** próximos passos no Coolify

## Primeira vez usando:

```bash
# Dar permissão de execução
chmod +x deploy.sh

# Executar
./deploy.sh
```

## Após executar o script:

1. Vá no **Coolify**
2. Clique em **"Force Rebuild"**
3. Aguarde 2-3 minutos
4. Acesse sua aplicação! 🎉

## Variáveis de Ambiente

O script vai gerar automaticamente:
- `JWT_SECRET` - Senha segura de 64 caracteres
- Mostrar todas as variáveis para copiar no Coolify

## Troubleshooting

### "Permission denied"
```bash
chmod +x deploy.sh
```

### "Not a git repository"
```bash
git init
git remote add origin https://github.com/seu-usuario/100_spoiler.git
```

### Build local falha
- Verifique se Docker está rodando
- Verifique se tem `docker-compose` instalado

## Opções Avançadas

### Apenas fazer push (sem testar)
Responda "n" quando perguntar sobre testar build local

### Testar localmente antes
Responda "s" e acesse:
- Frontend: http://localhost
- Backend: http://localhost:3000

## Suporte

Se tiver problemas, verifique:
1. Logs do script
2. Logs do Coolify
3. Arquivo `.env` está correto

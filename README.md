# Teddy URL Shortener

Sistema de encurtamento de URLs, implementando uma arquitetura de microsserviços com API Gateway.

## Arquitetura

O sistema é composto por três serviços principais:

1. **Auth Service** - Serviço de autenticação e gerenciamento de usuários
2. **URL Shortener Service** - Serviço de encurtamento de URLs
3. **Kong API Gateway** - Gateway de API para roteamento e gerenciamento de requisições

### Stack

- Node.js v22.15.1
- TypeScript
- PostgreSQL
- Bull queue
- Kong API Gateway
- Docker & Docker Compose

## Como Executar

### Pré-requisitos

- Docker
- Docker Compose
- Node.js v22.15.1 (obrigatório)
- Chaves RSA para JWT (gerar e configurar as variáveis de ambiente)

### Configuração

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/teddy-url-shortener.git
cd teddy-url-shortener
```

2. Configure o Node.js:

```bash
# Se você usa nvm
nvm use 22.15.1 || nvm install 22.15.1

# Ou instale diretamente a versão 22.15.1
```

3. Configure as variáveis de ambiente:

```bash
# Gerar chaves RSA para JWT
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem

# Crie um arquivo .env na raiz do projeto
echo "JWT_PRIVATE_KEY=$(cat private.pem | tr -d '\n')" > .env
echo "JWT_PUBLIC_KEY=$(cat public.pem | tr -d '\n')" >> .env
```

4. Inicie os serviços:

```bash
docker-compose up -d

# A API estará disponível em http://localhost:8080/
```

## Documentação da API

### Auth Service

- URL Local: http://localhost:3000/docs
- URL Gateway: http://localhost:8080/auth/docs
- Documentação completa dos endpoints de autenticação e usuários

### URL Shortener Service

- URL Local: http://localhost:3001/docs
- URL Gateway: http://localhost:8080/url-shortener/docs
- Documentação completa dos endpoints de encurtamento de URLs

## Endpoints Principais

### Autenticação

- POST /auth/register - Registro de usuário
- POST /auth/login - Login e obtenção do token JWT

### URL Shortener

- POST /shorten - Encurtar URL (público)
- GET /short-urls - Listar URLs do usuário (autenticado)
- PUT /short-urls/:shortCode - Atualizar URL (autenticado)
- DELETE /short-urls/:shortCode - Deletar URL (autenticado)
- GET /:shortCode - Redirecionar para URL original (público)

### Performance

- Cache de redirecionamentos no Kong
- Processamento em batch dos cliques de forma atômica
- Paginação no endpoint de listagem de urls

### Testes Unitários

- Use cases testados
- Controllers testados
- Services testados

### Padrões de Código

- ESLint para linting
- Prettier para formatação
- Husky para git hooks
- Commitlint para padronização de commits

## Pontos de Melhoria

1. Implementação de cache distribuido
2. Validação de URLs maliciosas
3. Implementação de testes de integração
4. Melhorias na documentação da API
5. Implementação de health checks
6. Adicionar ferramentas para observabilidade
7. Implementação de logs mais detalhados
8. Melhorias no tratamento de erros
9. CI/DC

## Licença

Este projeto é um teste técnico e não possui licença específica.

## Contribuição

Este é um projeto de teste técnico e não está aberto para contribuições externas.
